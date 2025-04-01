const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');
const { contactRateLimiter } = require('../middlewares/apiLimiter');
const validateContactForm = require('../middlewares/validateContact'); // Vérifie que l'import est correct

const router = express.Router();

// Appliquer le rate limiter et la validation sur la route de contact
router.post('/send-message', contactRateLimiter, validateContactForm, sendContactEmail);

module.exports = router;
