const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 100, // Limite : 100 requêtes par IP
    message: 'Trop de requêtes effectuées depuis cette IP, réessayez plus tard.',
});

module.exports = apiLimiter;
