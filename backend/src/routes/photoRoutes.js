const express = require('express');
const rateLimit = require('../middlewares/apiLimiter'); // Import du middleware rate limit
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const photoController = require('../controllers/photoController');
const validatePhoto = require('../middlewares/validatePhoto');

const router = express.Router();

// Appliquer le rate limit sur login pour éviter brute force
router.post('/login', rateLimit, photoController.login);

// Appliquer le rate limit sur la récupération des photos pour éviter un abus
router.get('/', rateLimit, photoController.getPhotos);

// Routes nécessitant authentification
router.post('/logout', authenticate('post /logout (photos)'), photoController.logout); 
router.post('/upload', authenticate('post /upload (photos)'), authorize('admin'), upload.single('image'), validatePhoto, handleUploadError, photoController.uploadPhoto);
router.get('/protected', authenticate('get /protected (photos)'), photoController.protectedRoute); 

// Routes nécessitant authentification et autorisation admin
router.delete('/:id', authenticate('delete /:id (photos)'), authorize('admin'), photoController.deletePhoto);
router.put('/:id', authenticate('put /:id (photos)'), authorize('admin'), validatePhoto, photoController.updatePhoto);

module.exports = router;
