/**
 * @file articleController.js
 * @description Contrôleur des articles : upload de fichiers Markdown, gestion des articles (CRUD), traitement de la cover photo.
 */


const Article = require('../models/Article');
const config = require('../config/Config');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { PutObjectCommand } = require('@aws-sdk/client-s3');

//upload d'un fichier Markdown et création d'un article
exports.uploadMarkdown = async (req, res, next) => {
    try {
        const mdFile = req.files?.file?.[0];
        if (!mdFile) {
            config.log('warn', 'Tentative d’upload sans fichier Markdown.');
            return res.status(400).json({ message: 'Aucun fichier .md fourni.' });
        }
        const content = mdFile.buffer.toString('utf-8');
        const originalName = mdFile.originalname.replace(/\.md$/i, '');
        const title = originalName.trim();
        const slug = originalName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        // Vérifie unicité du slug
        const existing = await Article.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: 'Un article avec ce slug existe déjà.' });
        }

        // Gestion de la cover photo optionnelle
        const coverFile = req.files?.fileCover?.[0];
        let coverPhotoPath = null;
        if (coverFile) {
            if (config.storageMode === 'aws') {
                const fileKey = `articles/${Date.now()}-${coverFile.originalname}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey,
                    Body: coverFile.buffer,
                    ContentType: coverFile.mimetype,
                };
                await config.s3.send(new PutObjectCommand(params));
                coverPhotoPath = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            } else if (config.storageMode === 'cloudinary') {
                const streamUpload = (buffer) =>
                    new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'articles',
                                quality: 'auto:good',
                                fetch_format: 'auto',
                            },
                            (error, result) => (result ? resolve(result) : reject(error))
                        );
                        stream.end(buffer);
                    });
                const result = await streamUpload(coverFile.buffer);
                coverPhotoPath = result.secure_url;
            } else {
                const uploadDir = path.join(__dirname, '../uploads/articles');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                const uploadName = `${Date.now()}-${coverFile.originalname}`;
                const uploadPath = path.join(uploadDir, uploadName);
                fs.writeFileSync(uploadPath, coverFile.buffer);
                coverPhotoPath = `/uploads/articles/${uploadName}`;
            }
        }

        // Création de l'article
        const article = new Article({
            title,
            slug,
            markdownContent: content,
            coverPhoto: coverPhotoPath,
            storageMode: config.storageMode,
        });
        await article.save();

        config.log('info', `Article créé : ${article.slug}`);
        res.status(201).json({ message: 'Article créé avec succès.', article });
    } catch (error) {
        config.log('error', `Erreur uploadMarkdown : ${error.message}`);
        next(error);
    }
};

//Lister tous les articles
exports.getAllArticles = async (req, res, next) => {
    try {
        const articles = await Article.find({}, 'title slug coverPhoto createdAt updatedAt').sort({ createdAt: -1 });
        config.log('info', 'Liste de tous les articles récupérée.');
        res.status(200).json({ articles });
    }
    catch (error) {
        config.log('error', `Erreur getAllArticles : ${error.message}`);
        next(error);
    }
};

//Récupérer un article par son slug
exports.getArticleBySlug = async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            config.log('warn', `Article non trouvé pour le slug ${req.params.slug}`);
            return res.status(404).json({ message: 'Article non trouvé.' });
        }
        config.log('info', `Article récupéré : ${article.slug}`);
        res.status(200).json({ article });
    } catch (error) {
        config.log('error', `Erreur getArticleBySlug : ${error.message}`);
        next(error);
    }
}

//Supprimer un article par son slug
exports.deleteArticleBySlug = async (req, res, next) => {
    try {
        const deleted = await Article.findOneAndDelete({ slug: req.params.slug });
        if (!deleted) {
            config.log('warn', `Tentative suppression article non existant : ${req.params.slug}`);
            return res.status(404).json({ message: 'Article non trouvé.' });
        }
        config.log('info', `Article supprimé : ${deleted.slug}`);
        res.status(200).json({ message: 'Article supprimé avec succès.' });
    } catch (error) {
        config.log('error', `Erreur deleteArticle : ${error.message}`);
        next(error);
    }
}