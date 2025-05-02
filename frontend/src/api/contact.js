/**
 * @file contact.js
 * @description Envoi des messages du formulaire de contact vers l’API backend.
 */

import axiosInstance from './axiosInstance';

// Envoie le message de contact
export const sendContactMessage = async (formData) => {
  try {
    const response = await axiosInstance.post('/contact/send-message', formData);
    return response.data; // { success: true/false, message: string, errors?: {} }
  } catch (error) {
    // Si le serveur a renvoyé une réponse avec des erreurs, on les renvoie
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // Sinon, renvoyer une erreur générique
    return { success: false, message: "Erreur lors de l'envoi du message." };
  }
};
