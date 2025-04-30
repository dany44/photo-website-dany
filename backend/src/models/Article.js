const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire.'],
      trim: true,
      minlength: [3, 'Le titre doit contenir au moins 3 caractères.'],
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères.'],
    },
    slug: {
      type: String,
      required: [true, 'Le slug est obligatoire.'],
      trim: true,
      unique: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Le slug doit être en minuscule, sans espaces, et utiliser des tirets entre les mots.'],
    },
    markdownContent: {
      type: String,
      required: [true, 'Le contenu Markdown est obligatoire.'],
    },
  }, {
    timestamps: true,
    versionKey: false,
  });

  module.exports = mongoose.model('Article', ArticleSchema);