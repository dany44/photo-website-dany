// routes/albumRoutes.js

const express = require('express');
const albumController = require('../controllers/albumController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../middlewares/uploadMiddleware');
const validateAlbum = require('../middlewares/validateAlbum');

const router = express.Router();

// Routes publiques
router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);

// Routes protégées (admin uniquement)
router.post('/', authenticate, authorize('admin'), upload.single('coverPhoto'), handleUploadError, albumController.createAlbum);
router.put('/:id', authenticate, authorize('admin'), upload.single('coverPhoto'), handleUploadError, albumController.updateAlbum);
router.delete('/:id', authenticate, authorize('admin'), albumController.deleteAlbum);

// Routes supplémentaires pour associer/déplacer des photos
router.post('/add-photo', authenticate, authorize('admin'), albumController.addPhotoToAlbum);
router.post('/move-photo', authenticate, authorize('admin'), albumController.movePhotoToAlbum);

module.exports = router;
