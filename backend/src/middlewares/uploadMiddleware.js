const multer = require('multer');
const config = require('../config/Config'); // Pour les logs

// Stockage en mémoire commun
const storage = multer.memoryStorage();

// Filtre pour les images JPG/PNG (album cover & photo uploads)
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const extname = allowed.test(file.originalname.toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    config.log('info', `Upload image réussi : ${file.originalname}`);
    cb(null, true);
  } else {
    config.log('warn', `Échec upload image : ${file.originalname}`);
    cb(new Error('Seules les images JPG et PNG sont autorisées.'));
  }
};

// Filtre pour les fichiers Markdown
const mdFilter = (req, file, cb) => {
  if (file.originalname.toLowerCase().endsWith('.md')) {
    config.log('info', `Upload Markdown réussi : ${file.originalname}`);
    cb(null, true);
  } else {
    config.log('warn', `Échec upload Markdown : ${file.originalname}`);
    cb(new Error('Seuls les fichiers .md sont autorisés.'));
  }
};

// Middleware pour l'upload de la couverture d'album (.single('coverPhoto'))
const uploadAlbumCover = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
}).single('coverPhoto');

// Middleware pour l'upload simple d'une photo (.single('image'))
const uploadPhoto = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
}).single('image');

// Middleware pour l'upload d'article (Markdown + cover optionnelle)
const uploadArticleFiles = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'file') return mdFilter(req, file, cb);
    if (file.fieldname === 'fileCover') return imageFilter(req, file, cb);
    cb(new Error(`Champ de fichier inattendu : ${file.fieldname}`));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo total
}).fields([
  { name: 'file', maxCount: 1 },      // Markdown
  { name: 'fileCover', maxCount: 1 }, // Image de couverture
]);

// Gestionnaire d'erreur Multer commun
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    config.log('error', `Erreur Multer : ${err.message}`);
    return res.status(400).json({ message: `Erreur d'upload : ${err.message}` });
  } else if (err) {
    config.log('error', `Erreur upload : ${err.message}`);
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  uploadAlbumCover,  
  uploadPhoto,       
  uploadArticleFiles,
  handleUploadError,
};
