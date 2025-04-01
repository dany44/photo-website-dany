// src/pages/Contact/ContactPage.jsx
import React from "react";

function ContactPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-6">Contact</h1>
        <p className="text-lg mb-6">
          Une question, un retour ou un projet en tête ?  
          N'hésitez pas à m'écrire à l'adresse suivante :
        </p>

        <p className="text-xl font-mono bg-gray-800 p-4 rounded-md inline-block break-all">
          <a
            href="mailto:danykhdr.photo@gmail.com"
            className="text-blue-400 hover:underline"
          >
            danykhdr.photo@gmail.com
          </a>
        </p>

        <p className="text-sm text-gray-400 mt-8">
          Je réponds dès que possible. Merci pour votre visite !
        </p>
      </div>
    </div>
  );
}

export default ContactPage;
