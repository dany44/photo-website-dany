const express = require('express');
const { apiLimiter } = require('../middlewares/apiLimiter'); // Import du middleware rate limit
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { uploadPhoto, handleUploadError } = require('../middlewares/uploadMiddleware');
const photoController = require('../controllers/photoController');
const validatePhoto = require('../middlewares/validatePhoto');

const router = express.Router();

//Rate limit sur login pour éviter brute force
router.post('/login', apiLimiter, photoController.login);

//Rate limit sur la récupération des photos pour éviter un abus
router.get('/', apiLimiter, photoController.getPhotos);

// Routes nécessitant authentification
router.post('/logout', authenticate('post /logout (photos)'), photoController.logout); 
router.post('/upload', authenticate('post /upload (photos)'), authorize('admin'), uploadPhoto, validatePhoto, handleUploadError, photoController.uploadPhoto);
router.get('/protected', authenticate(''), photoController.protectedRoute);

// Routes nécessitant authentification et autorisation admin
router.delete('/:id', authenticate('delete /:id (photos)'), authorize('admin'), photoController.deletePhoto);
router.put('/:id', authenticate('put /:id (photos)'), authorize('admin'), validatePhoto, photoController.updatePhoto);

module.exports = router;
