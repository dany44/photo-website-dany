const rateLimit = require('express-rate-limit');

// Rate limiter global (30 requêtes par 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 30,  // 30 requêtes
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
    headers: true,
});

// Nouveau rate limiter spécifique pour le formulaire de contact ou autres routes (5 requêtes par 15 minutes)
const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 500,  // 5 requêtes
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
    headers: true,
});

module.exports = { apiLimiter, contactRateLimiter };
