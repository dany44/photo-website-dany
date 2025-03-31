// src/components/layout/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
      <div className="max-w-6xl mx-auto text-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} - Dany Khadhar. Tous droits réservés.
        </p>
        <p className="text-sm mt-2">
          <a href="mailto:danykhdr.photo@gmail.com" className="hover:underline">
            danykhdr.photo@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
