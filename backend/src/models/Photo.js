const mongoose = require('mongoose');

// Définition du schéma pour les photos
const PhotoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire.'],
        trim: true,
        minlength: [3, 'Le titre doit contenir au moins 3 caractères.'],
        maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères.'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'La description ne peut pas dépasser 300 caractères.'],
    },
    imagePath: {
        type: String,
        required: [true, 'Le chemin de l’image est obligatoire.'],
        validate: {
            validator: function (v) {
                // Accepte les URLs (http/https) ou les chemins relatifs locaux
                return /^https?:\/\/.+$/.test(v) || /^\/uploads\/.+$/.test(v);
            },
            message: props => `${props.value} n'est pas une URL valide.`,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
    versionKey: false, // Désactive le champ __v
});

// Export du modèle Photo
const Photo = mongoose.model('Photo', PhotoSchema);
module.exports = Photo;
