/**
 * @file albumRoutes.js
 * @description Définition des routes liées aux albums photo : accès public et routes protégées pour la gestion CRUD et l'association de photos.
 */

const express = require('express');
const { apiLimiter } = require('../middlewares/apiLimiter');
const albumController = require('../controllers/albumController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { uploadAlbumCover, handleUploadError } = require('../middlewares/uploadMiddleware');
const validateAlbum = require('../middlewares/validateAlbum');

const router = express.Router();

// Appliquer rate limit sur les routes publiques
router.get('/', apiLimiter, albumController.getAllAlbums);
router.get('/:id', apiLimiter, albumController.getAlbumById);

// Routes protégées (admin uniquement)
router.post('/', authenticate('post / (albums)'), authorize('admin'), uploadAlbumCover, validateAlbum, handleUploadError, albumController.createAlbum);
router.put('/:id', authenticate('put /:id (albums)'), authorize('admin'), uploadAlbumCover, validateAlbum, handleUploadError, albumController.updateAlbum);
router.delete('/:id', authenticate('delete /:id (albums)'), authorize('admin'), albumController.deleteAlbum);

// Routes supplémentaires pour associer/déplacer des photos
router.post('/add-photo', authenticate('post /add-photo (albums)'), authorize('admin'), albumController.addPhotoToAlbum);
router.post('/move-photo', authenticate('post /move-photo (albums)'), authorize('admin'), albumController.movePhotoToAlbum);

module.exports = router;
