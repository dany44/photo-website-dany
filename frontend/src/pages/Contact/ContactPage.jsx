import React, { useState } from "react";
import { sendContactMessage } from "../../api/contact"; // Assurez-vous d'avoir cette fonction dans ton API

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // Pour afficher les messages de statut
  const [errors, setErrors] = useState({}); // Pour gérer les erreurs de validation spécifiques à chaque champ

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending..."); // Met à jour le status pour informer l'utilisateur que le message est en cours d'envoi
    setErrors({}); // Réinitialiser les erreurs avant d'envoyer le formulaire

    try {
      // Envoi du message au backend
      const response = await sendContactMessage(formData);
      console.log(response);

      // Vérifier la réponse
      if (response.success) {
        setStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" }); // Réinitialiser les champs du formulaire
      } else {
        // Si le backend renvoie des erreurs de validation, on les affiche
        setStatus(response.message || "Erreur lors de l'envoi du message. Essayez à nouveau.");
        setErrors(response.errors || {}); // Afficher les erreurs de validation spécifiques
      }
    } catch (error) {
      console.log("Erreur:", error);
      setStatus("Erreur lors de l'envoi du message. Essayez à nouveau.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white py-6 sm:py-10 px-4 sm:px-6">
      {/* Cadre gris englobant toute la section */}
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
        {/* Titre et description */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">Contact</h1>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            Une question, un retour ou un projet en tête ? N'hésitez pas à m'écrire en utilisant le formulaire ci-dessous :
          </p>
        </div>

        {/* Formulaire de contact */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="label-field">Nom</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="label-field">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="label-field">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="input-field"
              required
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          <div>
            <button type="submit" className="button-primary w-full sm:w-auto">
              Envoyer le message
            </button>
          </div>
        </form>

        {/* Message de statut */}
        {status && (
          <div className={`${status.includes("Erreur") ? "message-error" : "message-success"} mt-6`}>
            {status}
          </div>
        )}

        {/* Email pour contact direct, centré */}
        <div className="text-center mt-8 sm:mt-10">
          <p className="text-sm sm:text-base text-gray-400">Ou contactez-moi directement à l'adresse suivante :</p>
          <p className="text-xl sm:text-2xl font-mono bg-gray-800 p-4 rounded-md inline-block break-all">
            <a
              href="mailto:danykhdr.photo@gmail.com"
              className="text-blue-400 hover:underline"
            >
              danykhdr.photo@gmail.com
            </a>
          </p>

          <p className="text-sm sm:text-base text-gray-400 mt-6 sm:mt-8">
            Je réponds dès que possible. Merci pour votre visite !
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
