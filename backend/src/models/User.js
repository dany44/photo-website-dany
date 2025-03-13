const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import de bcrypt pour sécuriser les mots de passe

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Nom unique obligatoire
    email: { type: String, required: true, unique: true }, // Email unique obligatoire
    password: { type: String, required: true }, // Mot de passe hashé
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Définit le rôle par défaut à "user"
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement

// **Avant d’enregistrer un utilisateur, on hash le mot de passe**
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // Vérifie si le mot de passe a changé
    const salt = await bcrypt.genSalt(10); // Génère un sel pour le hashage
    this.password = await bcrypt.hash(this.password, salt); // Hash le mot de passe
    next(); // Continue le processus d’enregistrement
});

// **Méthode pour comparer les mots de passe lors du login**
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare le hash avec le mot de passe entré
};

const User = mongoose.model('User', UserSchema); // Création du modèle User
module.exports = User; // Export pour l’utiliser dans le contrôleur
