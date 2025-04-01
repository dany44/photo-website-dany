const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Photo = require('../models/Photo');
const Album = require('../models/Album');
const config = require('../config/Config'); // Logs et configurations globales
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;


// Génère un lien pré-signé pour S3
const generateSignedUrl = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    return await getSignedUrl(config.s3, new GetObjectCommand(params), { expiresIn: 3600 });
};

// Route : Connexion
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const adminUser = {
            username: 'admin',
            hashedPassword: process.env.ADMIN_HASHED_PASSWORD,
            role: 'admin',
        };

        if (username !== adminUser.username) {
            config.log('warn', `Tentative de connexion échouée (identifiant incorrect) : ${username}`);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        // Vérifier le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, adminUser.hashedPassword);
        if (!isMatch) {
            config.log('warn', `Tentative de connexion échouée (mot de passe incorrect) : ${username}`);
            return res.status(401).json({ message: 'Identifiants incorrects.' });
        }

        // Si tout est OK, on génère le token
        const token = config.jwt.sign({ username, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        config.log('info', `Utilisateur connecté : ${username}`);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en prod
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None si HTTPS, sinon Lax
            maxAge: 3600000, // 1h
          });
          
        return res.json({ message: 'Connexion réussie' });

    } catch (error) {
        next(error);
    }
};

// Route : Déconnexion
exports.logout = (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        config.log('info', 'Utilisateur déconnecté.');
        res.json({ message: 'Déconnexion réussie.' });
    } catch (error) {
        next(error);
    }
};

// Nouvelle Fonction : Route Protégée
exports.protectedRoute = (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Accès autorisé à la route protégée.',
            user: req.user, // Contient les informations décodées du token
        });
        config.log('debug', `Accès à la route protégée par l'utilisateur : ${req.user.username}`);
    } catch (error) {
        next(error);
    }
};

// Route : Upload de photo
exports.uploadPhoto = async (req, res, next) => {
    try {
        const { title, description, albumId } = req.body;

        if (!title || title.trim().length < 3 || title.trim().length > 100) {
            return res.status(400).json({ message: 'Le titre doit contenir entre 3 et 100 caractères.' });
        }
        if (description && description.trim().length > 300) {
            return res.status(400).json({ message: 'La description ne peut pas dépasser 300 caractères.' });
        }

        if (!req.file) {
            config.log('warn', 'Aucun fichier fourni pour l\'upload.');
            return res.status(400).json({ message: 'Aucun fichier fourni.' });
        }

        if (!albumId) {
            config.log('warn', 'Aucun album spécifié pour la photo.');
            return res.status(400).json({ message: 'Aucun album spécifié.' });
        }

        const album = await Album.findById(albumId);
        if (!album) {
            config.log('warn', `Album non trouvé : ${albumId}`);
            return res.status(404).json({ message: 'Album non trouvé.' });
        }
        let imagePath;
        let publicId = null; // Pour Cloudinary

        if (config.storageMode === 'aws') {
            // Upload vers S3
            const fileKey = `photos/${Date.now()}-${req.file.originalname}`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            await config.s3.send(new PutObjectCommand(params));
            imagePath = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        } else if (config.storageMode === 'cloudinary') {
            // Upload vers Cloudinary
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'photos',
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
            imagePath = result.secure_url;
            publicId = result.public_id;
        } else {
            // Enregistrer localement
            const uploadDir = path.join(__dirname, '../uploads/photos');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const uploadPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
            fs.writeFileSync(uploadPath, req.file.buffer);
            imagePath = `/uploads/photos/${path.basename(uploadPath)}`;
        }

        // Créer la photo en incluant le publicId si nécessaire
        const newPhotoData = { title, description, imagePath, storageMode: config.storageMode };
        if (config.storageMode === 'cloudinary') {
            newPhotoData.publicId = publicId;
        }
        const newPhoto = new Photo(newPhotoData);

        await newPhoto.save();

        // Associer la photo à l'album
        album.photos.push(newPhoto._id);
        await album.save();

        config.log('info', `Photo ajoutée à l'album ${album.name} : ${newPhoto.title}`);
        res.status(201).json({ message: 'Photo téléchargée avec succès.', photo: newPhoto });
    } catch (error) {
        next(error);
    }
};

// Route : Récupération des photos
exports.getPhotos = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Page actuelle (par défaut : 1)
        const limit = parseInt(req.query.limit) || 25; // Limite d'éléments par page (par défaut : 25)
        const skip = (page - 1) * limit; // Nombre d'éléments à sauter

        // Ajout du tri par date de création, du plus récent au plus ancien
        const photos = await Photo.find({ storageMode: config.storageMode })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Photo.countDocuments({ storageMode: config.storageMode }); // Nombre total de documents
        const totalPages = Math.ceil(total / limit); // Calcul du nombre total de pages

        const photosWithUrls = await Promise.all(
            photos.map(async (photo) => {
                if (config.storageMode === 'aws') {
                    const key = photo.imagePath.split('.com/')[1];
                    const signedUrl = await generateSignedUrl(key);
                    return { ...photo.toObject(), signedUrl };
                } else if (config.storageMode === 'cloudinary') {
                    return { ...photo.toObject(), signedUrl: photo.imagePath }; // URL Cloudinary
                } else {
                    return { ...photo.toObject(), signedUrl: photo.imagePath }; // URL locale
                }
            })
        );

        res.status(200).json({
            photos: photosWithUrls,
            total,
            totalPages,
            currentPage: page,
        });
        config.log('info', `Photos récupérées pour la page ${page}`);
    } catch (error) {
        next(error);
    }
};

// Route : Suppression de photo
exports.deletePhoto = async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            config.log('warn', `Photo introuvable : ${req.params.id}`);
            return res.status(404).json({ message: 'Photo non trouvée.' });
        }

        if (config.storageMode === 'aws') {
            const key = new URL(photo.imagePath).pathname.slice(1);
            await config.s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }));
        } else if (config.storageMode === 'cloudinary') {
            // Suppression via Cloudinary en utilisant le publicId stocké
            if (photo.publicId) {
                await cloudinary.uploader.destroy(photo.publicId);
            }
        } else {
            const filePath = path.join(__dirname, '../uploads', path.basename(photo.imagePath));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Supprime le fichier localement
            }
        }

        await photo.deleteOne();
        config.log('info', `Photo supprimée : ${req.params.id}`);
        res.status(200).json({ message: 'Photo supprimée avec succès.' });
    } catch (error) {
        next(error);
    }
};

// Route : Mise à jour de photo
exports.updatePhoto = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            config.log('warn', `Photo introuvable pour mise à jour : ${req.params.id}`);
            return res.status(404).json({ message: 'Photo non trouvée.' });
        }

        if (title) photo.title = title;
        if (description) photo.description = description;
        await photo.save();

        config.log('info', `Photo mise à jour : ${req.params.id}`);
        res.status(200).json({ message: 'Photo mise à jour avec succès.', photo });
    } catch (error) {
        next(error);
    }
};
