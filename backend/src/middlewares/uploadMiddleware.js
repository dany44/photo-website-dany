const multer = require('multer');
const config = require('../config/Config'); // Pour les logs

// Types de fichiers autorisés
const allowedTypes = /jpeg|jpg|png/;

// Fonction de filtrage des fichiers
const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        config.log('info', `Upload réussi : ${file.originalname}`);
        cb(null, true);
    } else {
        const error = new Error('Seuls les fichiers JPG et PNG sont autorisés.');
        config.log('warn', `Échec de l'upload : ${file.originalname} - Type de fichier non autorisé.`);
        cb(error);
    }
};

// Configuration de Multer
const upload = multer({
    storage: multer.memoryStorage(), // Stockage en mémoire uniquement
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Taille maximale : 5 Mo
    },
});

// Middleware d'erreur personnalisé pour Multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        config.log('error', `Erreur Multer : ${err.message}`);
        return res.status(400).json({ message: `Erreur d'upload : ${err.message}` });
    } else if (err) {
        config.log('error', `Erreur inconnue pendant l'upload : ${err.message}`);
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = {
    upload,
    handleUploadError,
};
