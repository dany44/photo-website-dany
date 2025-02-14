// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const config = require('../config/Config'); // Importer la classe Config pour les logs

// Middleware d'authentification
const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Extraire le token du cookie

    if (!token) {
        config.log('warn', 'Tentative d’accès sans token ou avec un cookie manquant.');
        return res.status(401).json({ message: 'Accès refusé. Token manquant ou incorrect.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attacher les données décodées au req
        next();
    } catch (error) {
        config.log('error', `Token invalide : ${error.message}`);
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

// Middleware pour vérifier le rôle de l'utilisateur
const authorize = (roles = []) => {
    // Convertir en tableau si un seul rôle est fourni
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!roles.length || roles.includes(req.user.role)) {
            next();
        } else {
            config.log('warn', `Accès refusé pour l'utilisateur avec le rôle ${req.user.role}.`);
            return res.status(403).json({ message: 'Accès refusé. Rôle insuffisant.' });
        }
    };
};

module.exports = {
    authenticate,
    authorize,
};
