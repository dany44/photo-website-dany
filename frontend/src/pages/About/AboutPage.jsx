// src/pages/About/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b text-gray-100 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6 text-center sm:text-left tracking-tight">
                    À Propos de Moi
                </h1>
                <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 text-center sm:text-left">
                    Je m'appelle Dany Khadhar. Amateur de photographie, j'ai créé ce site pour partager mes clichés réalisés lors de mes déplacements. Attiré par la nature, la culture et les modes de vie authentiques, je rassemble ici mes photos, réalisées avec une approche simple et personnelle, mettant en avant l'authenticité de chaque instant.
                </p>
                <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Matériel</h2>
                    <ul className="list-disc list-inside text-sm sm:text-base leading-relaxed space-y-2 text-center sm:text-left">
                        <li>
                            <strong>Sony a6400</strong> – Un appareil compact et léger, idéal pour mes voyages.
                        </li>
                        <li>
                            <strong>Sony E PZ 16-50mm f/3.5-5.6 OSS</strong> – Un objectif polyvalent, pour les prises de vue en grand-angle au quotidien.
                        </li>
                        <li>
                            <strong>Sigma 56mm f/1.4 DC DN Contemporary</strong> – Un objectif fixe qui me permet de capturer des portraits et de travailler en basse lumière.
                        </li>
                        <li>
                            <strong>Sony FE 70-350mm f/4.5-6.3 G OSS</strong> – Un téléobjectif pour photographier des sujets éloignés.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
