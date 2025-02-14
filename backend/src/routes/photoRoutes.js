// routes/photoRoutes.js

const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware'); // Importer authorize
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const photoController = require('../controllers/photoController');
const validatePhoto = require('../middlewares/validatePhoto');

const router = express.Router();

// Routes publiques
router.post('/login', photoController.login);
router.get('/', photoController.getPhotos);

// Routes nécessitant authentification
router.post('/logout', authenticate, photoController.logout); 
router.post('/upload', authenticate, authorize('admin'), upload.single('image'), validatePhoto, handleUploadError, photoController.uploadPhoto);
router.get('/protected', authenticate, photoController.protectedRoute); 

// Routes nécessitant authentification et autorisation admin
router.delete('/:id', authenticate, authorize('admin'), photoController.deletePhoto);
router.put('/:id', authenticate, authorize('admin'), validatePhoto, photoController.updatePhoto);

module.exports = router;
