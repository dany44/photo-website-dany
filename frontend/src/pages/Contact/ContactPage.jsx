// src/pages/Contact/ContactPage.jsx
import React, { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    try {
      setTimeout(() => {
        setStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      }, 1500);
    } catch (error) {
      setStatus("Erreur lors de l'envoi du message. Essayez à nouveau.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white py-20 px-4">
      {/* Cadre gris englobant toute la section */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700">
        {/* Titre et description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-6">Contact</h1>
          <p className="text-lg mb-6">
            Une question, un retour ou un projet en tête ?  
            N'hésitez pas à m'écrire en utilisant le formulaire ci-dessous :
          </p>
        </div>

        {/* Formulaire de contact */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>

          <div>
            <button type="submit" className="button-primary w-full">
              Envoyer le message
            </button>
          </div>
        </form>

        {/* Message de statut */}
        {status && (
          <div
            className={`${
              status.includes("Erreur") ? "message-error" : "message-success"
            } mt-6`}
          >
            {status}
          </div>
        )}

        {/* Email pour contact direct */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Ou contactez-moi directement à l'adresse suivante :
          </p>
          <p className="text-xl font-mono bg-gray-800 p-4 rounded-md inline-block break-all mt-4">
            <a
              href="mailto:danykhdr.photo@gmail.com"
              className="text-blue-400 hover:underline"
            >
              danykhdr.photo@gmail.com
            </a>
          </p>
        </div>

        {/* Message de remerciement */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Je réponds dès que possible. Merci pour votre visite !
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
