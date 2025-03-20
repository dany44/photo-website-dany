// controllers/albumController.js

const Album = require('../models/Album');
const Photo = require('../models/Photo');
const config = require('../config/Config'); // Pour les logs et configurations globales
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Génère un lien pré-signé pour S3 
const generateSignedUrl = async (key) => {
    if (config.storageMode !== 'aws') return null;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    return await getSignedUrl(config.s3, new GetObjectCommand(params), { expiresIn: 3600 });
};

// Créer un nouvel album
exports.createAlbum = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Validation côté serveur basée sur votre modèle Mongoose
        if (!name || name.trim().length < 3 || name.trim().length > 100) {
            return res.status(400).json({ message: "Le nom de l'album doit contenir entre 3 et 100 caractères." });
        }
        if (description && description.trim().length > 500) {
            return res.status(400).json({ message: "La description ne peut pas dépasser 500 caractères." });
        }

        let coverPhotoPath = null;
        let publicId = null; // Pour Cloudinary

        if (req.file) {
            if (config.storageMode === 'aws') {
                const fileKey = `albums/${Date.now()}-${req.file.originalname}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };
                await config.s3.send(new PutObjectCommand(params));
                coverPhotoPath = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            } else if (config.storageMode === 'cloudinary') {
                // Upload vers Cloudinary
                const streamUpload = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'albums',      // Dossier de stockage
                                quality: 'auto:good',  // compression automatique avec une qualité "good"
                                fetch_format: 'auto',   // conversion automatique au format optimal (ex. WebP)
                            },
                            (error, result) => {
                                if (result) {
                                    resolve(result);
                                } else {
                                    reject(error);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                };
                const result = await streamUpload(req.file.buffer);
                coverPhotoPath = result.secure_url;
                publicId = result.public_id;
            } else {
                // Enregistrer localement
                const uploadDir = path.join(__dirname, '../uploads/albums');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                const uploadPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
                fs.writeFileSync(uploadPath, req.file.buffer);
                coverPhotoPath = `/uploads/albums/${path.basename(uploadPath)}`;
            }
        }

        const newAlbum = new Album({
            name: name.trim(),
            description: description ? description.trim() : '',
            coverPhoto: coverPhotoPath,
            publicId: publicId, // Stocker le publicId si upload Cloudinary
            storageMode: config.storageMode,
        });

        await newAlbum.save();

        config.log('info', `Album créé : ${newAlbum.name}`);
        res.status(201).json({ message: 'Album créé avec succès.', album: newAlbum });
    } catch (error) {
        next(error);
    }
};

// Récupérer tous les albums
exports.getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find({ storageMode: config.storageMode }).populate('photos');

        // Gérer la coverPhoto selon le mode de stockage
        if (config.storageMode === 'aws') {
            // Générer une URL signée pour chaque coverPhoto (si existante)
            for (const album of albums) {
                if (album.coverPhoto) {
                    const splitted = album.coverPhoto.split('.com/');
                    if (splitted.length > 1) {
                        const key = splitted[1];
                        const signedUrl = await generateSignedUrl(key);
                        album.coverPhoto = signedUrl;
                    }
                }
            }
        } else if (config.storageMode === 'local') {
            // Pour le stockage local
            for (const album of albums) {
                if (album.coverPhoto && album.coverPhoto.startsWith('/uploads/')) {
                    album.coverPhoto = `http://localhost:3000${album.coverPhoto}`;
                }
            }
        }
        // Pour Cloudinary, l'URL est déjà sécurisée (secure_url)
        res.status(200).json({ albums });
        config.log('info', 'Tous les albums ont été récupérés.');
    } catch (error) {
        next(error);
    }
};

// Récupérer un album par ID
exports.getAlbumById = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id).populate('photos');
        if (!album) {
            config.log('warn', `Album non trouvé : ${req.params.id}`);
            return res.status(404).json({ message: 'Album non trouvé.' });
        }

        // Filtrer les photos selon le mode de stockage courant
        const filteredPhotos = album.photos.filter(photo => photo.storageMode === config.storageMode);

        if (config.storageMode === 'aws') {
            const photosWithUrls = await Promise.all(
                filteredPhotos.map(async (photo) => {
                    const key = photo.imagePath.split('.com/')[1];
                    const signedUrl = await generateSignedUrl(key);
                    return { ...photo.toObject(), signedUrl };
                })
            );
            res.status(200).json({ album: { ...album.toObject(), photos: photosWithUrls } });
        } else {
            const photosWithUrls = filteredPhotos.map(photo => ({
                ...photo.toObject(),
                signedUrl: photo.imagePath
            }));
            res.status(200).json({ album: { ...album.toObject(), photos: photosWithUrls } });
            config.log('info', `Toutes les photos de l'album ${req.params.id} ont été récupérées.`);
        }
    } catch (error) {
        next(error);
    }
};

// Mettre à jour un album
exports.updateAlbum = async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const album = await Album.findById(req.params.id);
  
      if (!album) {
        config.log('warn', `Album non trouvé pour mise à jour : ${req.params.id}`);
        return res.status(404).json({ message: 'Album non trouvé.' });
      }
  
      // Validation côté serveur
      if (name && (name.trim().length < 3 || name.trim().length > 100)) {
        return res.status(400).json({ message: "Le nom de l'album doit contenir entre 3 et 100 caractères." });
      }
      if (description && description.trim().length > 500) {
        return res.status(400).json({ message: "La description ne peut pas dépasser 500 caractères." });
      }
  
      if (name) album.name = name.trim();
      if (description) album.description = description.trim();
  
      if (req.file) {
        // Supprimer l'ancienne photo de couverture si elle existe
        if (album.coverPhoto) {
          if (config.storageMode === 'aws') {
            const key = album.coverPhoto.split('.com/')[1];
            await config.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }));
          } else if (config.storageMode === 'cloudinary') {
            if (album.publicId) {
                console.log(album.name, " " , album.publicId);
              // Supprimer l'ancienne image de Cloudinary
              await cloudinary.uploader.destroy(album.publicId);
            }
          } else {
            const filePath = path.join(__dirname, '../', album.coverPhoto);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
        }
  
        // Télécharger la nouvelle photo de couverture
        if (config.storageMode === 'aws') {
          const fileKey = `albums/${Date.now()}-${req.file.originalname}`;
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          };
          await config.s3.send(new PutObjectCommand(params));
          album.coverPhoto = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
          album.publicId = null; // Réinitialiser le publicId
        } else if (config.storageMode === 'cloudinary') {
          const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: 'albums',
                  quality: 'auto:good',  // compression automatique optimisée
                  fetch_format: 'auto',   // conversion au format optimal (ex. WebP)
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
              stream.end(buffer);
            });
          };
          const result = await streamUpload(req.file.buffer);
          album.coverPhoto = result.secure_url;
          album.publicId = result.public_id;
        } else {
          const uploadDir = path.join(__dirname, '../uploads/albums');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const uploadPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
          fs.writeFileSync(uploadPath, req.file.buffer);
          album.coverPhoto = `/uploads/albums/${path.basename(uploadPath)}`;
        }
      }
  
      await album.save();
  
      config.log('info', `Album mis à jour : ${album.name}`);
      res.status(200).json({ message: 'Album mis à jour avec succès.', album });
    } catch (error) {
      next(error);
    }
  };
  
// Supprimer un album
exports.deleteAlbum = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id).populate('photos');

        if (!album) {
            config.log('warn', `Album non trouvé pour suppression : ${req.params.id}`);
            return res.status(404).json({ message: 'Album non trouvé.' });
        }

        if (album.photos.length > 0) {
            config.log('warn', `Tentative de suppression d'un album contenant des photos : ${album.name}`);
            return res.status(400).json({ message: 'Impossible de supprimer un album contenant des photos.' });
        }

        if (album.coverPhoto) {
            if (config.storageMode === 'aws') {
                const key = album.coverPhoto.split('.com/')[1];
                await config.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }));
            } else if (config.storageMode === 'cloudinary') {
                if (album.publicId) {
                    await cloudinary.uploader.destroy(album.publicId);
                }
            } else {
                const filePath = path.join(__dirname, '../', album.coverPhoto);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }

        await album.deleteOne();
        config.log('info', `Album supprimé : ${album.name}`);
        res.status(200).json({ message: 'Album supprimé avec succès.' });
    } catch (error) {
        next(error);
    }
};

// Ajouter une photo à un album
exports.addPhotoToAlbum = async (req, res, next) => {
    try {
        const { albumId, photoId } = req.body;

        const album = await Album.findById(albumId);
        const photo = await Photo.findById(photoId);

        if (!album || !photo) {
            config.log('warn', `Album ou Photo non trouvé : Album ID ${albumId}, Photo ID ${photoId}`);
            return res.status(404).json({ message: 'Album ou Photo non trouvé.' });
        }

        if (!album.photos.includes(photoId)) {
            album.photos.push(photoId);
            await album.save();
            config.log('info', `Photo ajoutée à l'album ${album.name} : Photo ID ${photoId}`);
        }

        res.status(200).json({ message: 'Photo ajoutée à l\'album avec succès.', album });
    } catch (error) {
        next(error);
    }
};

// Déplacer une photo d'un album à un autre
exports.movePhotoToAlbum = async (req, res, next) => {
    try {
        const { fromAlbumId, toAlbumId, photoId } = req.body;

        const fromAlbum = await Album.findById(fromAlbumId);
        const toAlbum = await Album.findById(toAlbumId);
        const photo = await Photo.findById(photoId);

        if (!fromAlbum || !toAlbum || !photo) {
            config.log('warn', `Album ou Photo non trouvé lors du déplacement : Photo ID ${photoId}`);
            return res.status(404).json({ message: 'Album ou Photo non trouvé.' });
        }

        fromAlbum.photos = fromAlbum.photos.filter(id => id.toString() !== photoId);
        await fromAlbum.save();

        if (!toAlbum.photos.includes(photoId)) {
            toAlbum.photos.push(photoId);
            await toAlbum.save();
            config.log('info', `Photo déplacée de l'album ${fromAlbum.name} à l'album ${toAlbum.name} : Photo ID ${photoId}`);
        }

        res.status(200).json({ message: 'Photo déplacée avec succès.', fromAlbum, toAlbum });
    } catch (error) {
        next(error);
    }
};
