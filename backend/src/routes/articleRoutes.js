/**
 * @file articleRoutes.js
 * @description Définition des routes publiques et sécurisées liées aux articles markdown (upload, suppression, récupération).
 */

const express = require('express');
const { apiLimiter } = require('../middlewares/apiLimiter'); // Import du middleware rate limit
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { uploadArticleFiles, handleUploadError } = require('../middlewares/uploadMiddleware');
const articleController = require('../controllers/articleController');

const router = express.Router();

//Routes publiques 
router.get('/', apiLimiter, articleController.getAllArticles);
router.get('/:slug', apiLimiter, articleController.getArticleBySlug);

// Routes nécessitant authentification
router.post('/upload', authenticate('post /upload (articles)'), authorize('admin'), uploadArticleFiles, handleUploadError, articleController.uploadMarkdown);
router.delete('/:slug', authenticate('delete /:slug (articles)'), authorize('admin'), articleController.deleteArticleBySlug);

module.exports = router;