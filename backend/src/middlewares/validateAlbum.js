// middlewares/validateAlbum.js
const Joi = require('joi');

// Schéma de validation pour un album
const albumValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    // coverPhoto sera géré par multer, donc pas besoin de le valider ici
});

// Middleware de validation
const validateAlbum = (req, res, next) => {
    const { error } = albumValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateAlbum;
