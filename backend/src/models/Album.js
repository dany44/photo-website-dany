/**
 * @file Album.js
 * @description Modèle Mongoose pour les albums photo, avec validation des champs et référence aux photos associées.
 */

const mongoose = require('mongoose');

// Définition du schéma pour les albums
const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de l\'album est obligatoire.'],
        trim: true,
        minlength: [3, 'Le nom de l\'album doit contenir au moins 3 caractères.'],
        maxlength: [100, 'Le nom de l\'album ne peut pas dépasser 100 caractères.'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères.'],
    },
    coverPhoto: {
        type: String, // URL de la photo de couverture
        validate: {
            validator: function(v) {
                // Accepte les URLs (http/https) ou les chemins relatifs locaux
                return /^https?:\/\/.+$/.test(v) || /^\/uploads\/.+$/.test(v);
            },
            message: props => `${props.value} n'est pas une URL valide.`,
        },
    },
    publicId: {
        type: String,
        default: null,
    },
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
    }],
    storageMode: { 
        type: String, 
        enum: ['aws', 'cloudinary', 'local'], 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Album = mongoose.model('Album', AlbumSchema);
module.exports = Album;
