// src/controllers/contactController.js
const nodemailer = require('nodemailer'); // Importer Nodemailer
const config = require('../config/Config'); // Pour les logs et configurations globales

// Fonction pour envoyer l'email
exports.sendContactEmail = async (req, res, next) => {
  const { name, email, message } = req.body;

  // Valider les champs (nom, email, message) - Cas si les champs sont manquants
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Tous les champs sont requis."
    });
  }

  try {
    // Configurer le transporteur de Nodemailer (utilisation de Gmail dans cet exemple)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // ton email Gmail
        pass: process.env.GMAIL_PASSWORD, // ton mot de passe (ou un "App Password" si tu utilises 2FA)
      },
    });

    // Configuration de l'email
    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER, 
      subject: `Message de ${name} via le formulaire de contact`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    config.log('info', `Email envoyé : ${email}`);
    res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });

  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message. Essayez à nouveau.' });
  }
};
