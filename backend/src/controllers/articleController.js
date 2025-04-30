const Article = require('../models/articleModel');
const config = require('../config/Config');

//upload d'un fichier Markdown et création d'un article
exports.uploadMarkdown = async (req, res, next) => {
    try {
        if (!req.file) {
            config.log('warn', 'Tentative d’upload sans fichier Markdown.');
            return res.status(400).json({ message: 'Auncun fichier .md fourni.' });
        }
        const content = req.file.buffer.toString('utf-8');
        const originalName = req.file.originalname.replace(/\.md$/i, '');
        const title = originalName.trim();
        const slug = originalName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const existing = await Article.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: 'Un article avec ce slug existe déjà.' });
        }
        const article = new Article({
            title,
            slug,
            markdownContent: content,
        });
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
        const articles = await Article.find({}, 'title slug createdAt updatedAt').sort({ createdAt: -1 });
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