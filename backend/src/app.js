require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/Config'); 
const photoRoutes = require('./routes/photoRoutes');
const albumRoutes = require('./routes/albumRoutes');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser'); 

const app = express();

// Initialiser la base de données
config.connectDB();

// Middleware pour autoriser les requêtes CORS
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3001'];

app.use(cors({
  origin: function(origin, callback) {
    // En production, on rejette les requêtes sans origine
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('Origin not allowed by CORS'), false);
      }
      // En développement, on autorise même sans origine (utile pour Postman, etc.)
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    } else {
      return callback(new Error('Origin not allowed by CORS'), false);
    }
  },
  credentials: true,
}));

app.set('trust proxy', true);


app.use(compression()); // Active la compression pour toutes les réponses

app.use(helmet());

app.use(mongoSanitize());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour parser les cookies
app.use(cookieParser());

// Routes principales
app.use('/photos', photoRoutes);
app.use('/albums', albumRoutes);
// Route de test
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Photo Gallery !');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    config.log('error', `${err.message} - ${req.method} ${req.originalUrl}`);
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur.',
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    config.log('info', `Serveur démarré sur http://localhost:${PORT}`);
});

