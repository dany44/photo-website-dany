/**
 * @file validatePhoto.js
 * @description Middleware de validation des champs nécessaires à l’upload ou la modification d’une photo (titre, description, albumId).
 */

const Joi = require('joi');

// Schéma de validation pour une photo
const photoValidationSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(200).optional(),
    albumId: Joi.string().required(), 
});

// Middleware de validation
const validatePhoto = (req, res, next) => {
    const { error } = photoValidationSchema.validate(req.body);
    if (error) {
        console.log(error)
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validatePhoto;
