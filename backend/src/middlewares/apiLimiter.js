const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 30, 
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
    headers: true, 
});

module.exports = apiLimiter;
