const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
    headers: true, 
    handler: (req, res, next) => {
        console.log(`Rate limit dépassé pour ${req.ip}`);
        res.status(429).json({ message: 'Trop de requêtes, veuillez réessayer plus tard.' });
    }
});


module.exports = apiLimiter;
