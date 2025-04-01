// src/middlewares/validateContact.js
const Joi = require('joi');

// Schéma de validation pour le formulaire de contact
const contactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Le nom est requis.',
    'string.min': 'Le nom doit avoir au moins 3 caractères.',
    'string.max': 'Le nom doit avoir moins de 100 caractères.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'L\'email est requis.',
    'string.email': 'L\'email doit être valide.',
  }),
  message: Joi.string().min(10).required().messages({
    'string.empty': 'Le message est requis.',
    'string.min': 'Le message doit avoir au moins 10 caractères.',
  }),
});

// Middleware de validation
const validateContactForm = (req, res, next) => {
    const { error } = contactValidationSchema.validate(req.body);
    if (error) {
      const errors = {};
      error.details.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
  
module.exports =  validateContactForm;
