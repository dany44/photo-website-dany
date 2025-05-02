/**
 * @file Footer.jsx
 * @description Pied de page du site avec droits d’auteur et lien vers la page de contact.
 */
import React from 'react';
import { NavLink } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
            <div className="max-w-6xl mx-auto text-center px-4">
                <div className="flex flex-col items-center gap-2 text-sm">
                    <p>© {new Date().getFullYear()} - Dany Khadhar. Tous droits réservés.</p>
                    <NavLink
                        to="/contact"
                        className="hover:underline text-blue-400"
                    >
                        Me contacter
                    </NavLink>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
