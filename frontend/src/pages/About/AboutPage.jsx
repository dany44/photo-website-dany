// src/pages/About/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <div className="max-w-3xl bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">À Propos de Moi</h1>
                <div className="flex flex-col md:flex-row items-center mb-6">
                    <div>
                        <p className="text-lg mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p className="text-lg">
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Mon Parcours</h2>
                <ul className="list-disc list-inside mb-6">
                    <li>Lorem ipsum dolor sit amet.</li>
                    <li>Consectetur adipiscing elit.</li>
                    <li>Sed do eiusmod tempor incididunt.</li>
                </ul>
                <h2 className="text-2xl font-semibold mb-4">Ma Mission</h2>
                <p className="text-lg mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <h2 className="text-2xl font-semibold mb-4">Contactez-Moi</h2>
                <p className="text-lg">
                    Pour toute demande de collaboration ou pour en savoir plus sur mes travaux, n'hésitez pas à me contacter à l'adresse suivante :
                    <a href="mailto:danykhadhar@hotmail.fr" className="text-blue-400 underline ml-1">danykhadhar@hotmail.fr</a>
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
