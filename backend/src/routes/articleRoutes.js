const express = require('express');
const { apiLimiter } = require('../middlewares/apiLimiter'); // Import du middleware rate limit
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { mdUpload, handleUploadError } = require('../middlewares/uploadMiddleware');
const articleController = require('../controllers/articleController');

const router = express.Router();

//Routes publiques 
router.get('/', apiLimiter, articleController.getAllArticles);
router.get('/:slug', apiLimiter, articleController.getArticleBySlug);

// Routes nécessitant authentification
router.post('/upload', authenticate('post /upload (articles)'), authorize('admin'), mdUpload.single('file'), handleUploadError, articleController.uploadMarkdown);
router.delete('/:slug', authenticate('delete /:slug (articles)'), authorize('admin'), articleController.deleteArticleBySlug);

module.exports = router;