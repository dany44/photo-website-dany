// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const config = require('../config/Config');

// Middleware d'authentification avec paramètre de personnalisation
const authenticate = (customLogContext = '') => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            config.log('warn', `Tentative d'accès à la route ${customLogContext} sans token ou avec un cookie manquant.`);
            return res.status(401).json({ message: 'Accès refusé. Token manquant ou incorrect.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            config.log('error', `Token invalide : ${error.message} ${customLogContext}`);
            return res.status(403).json({ message: 'Token invalide ou expiré.' });
        }
    };
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