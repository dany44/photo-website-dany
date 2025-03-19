// src/pages/Home/HomePage.jsx
import React from 'react';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { NavLink } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';

// Imports pour le carrousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Composant flèche de droite
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} text-white text-4xl cursor-pointer z-10`}
      style={{
        ...style,
        right: '20px',
      }}
      onClick={onClick}
    />
  );
}

// Composant flèche de gauche
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} text-white text-4xl cursor-pointer z-10`}
      style={{
        ...style,
        left: '20px',
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
}

function HomePage() {
  const { albums, isLoading, error } = useAlbums();

  if (isLoading) {
    return <div className="text-center text-white mt-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-4">{error.message}</div>;
  }

  // Configuration du carrousel react-slick
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots custom-dots", // On ajoute notre classe personnalisée
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="bg-gray-900 min-h-screen pb-8 relative font-sans text-gray-100">
      {/* === Carrousel pleine largeur === */}
      <div className="w-full mb-8">
        <Slider {...sliderSettings}>
          {albums.map((album) => (
            <div key={album._id} className="relative">
              {/* Slide : image de couverture */}
              <div className="relative w-full h-[60vh] overflow-hidden">
                {album.coverPhoto ? (
                  <img
                    crossOrigin="anonymous"
                    src={album.coverPhoto}
                    alt={album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Aucune couverture</span>
                  </div>
                )}
                {/* Overlay titre au centre */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4 text-center">
                  <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-2 title-shadow">
                    {album.name}
                  </h2>
                  {album.description && (
                    <p className="text-gray-200 text-sm md:text-base max-w-xl leading-relaxed">
                      {album.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* === Section Bienvenue === */}
      <section className="bg-gray-800 text-white py-16 px-4 mt-12 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Bienvenue</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat nunc at
            odio sollicitudin, in dictum sapien faucibus. Suspendisse potenti. In hac habitasse
            platea dictumst. Fusce vel scelerisque sapien.
          </p>
        </div>
      </section>

      {/* === Section Albums centrée (Portfolio) === */}
      <section className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center tracking-tight">Portfolio</h2>
          {/* Section descriptive pour le Portfolio */}
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection d'albums qui capturent des instants uniques et vous invitent
            à explorer un univers visuel riche et inspirant.
          </p>
          {/* Grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <NavLink
                to={`/album/${album._id}`}
                key={album._id}
                className="group bg-gray-800 text-gray-200 rounded-md shadow-lg overflow-hidden
                           transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Zone d'image avec ratio fixe (4/3) */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {album.coverPhoto ? (
                    <img
                      crossOrigin="anonymous"
                      src={album.coverPhoto}
                      alt={album.name}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-300
                                 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Aucune couverture</span>
                    </div>
                  )}
                  {/* Overlay blanc + chevrons >> */}
                  <div className="absolute inset-0 bg-white bg-opacity-0 flex items-center justify-center
                                  opacity-0 transition-all duration-300 group-hover:bg-opacity-40 group-hover:opacity-100">
                    <span className="text-black text-6xl font-light">»</span>
                  </div>
                </div>
                {/* Contenu texte */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.name}</h3>
                  {album.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{album.description}</p>
                  )}
                  <p className="italic text-xs text-gray-400 mt-2">
                    By Dany | {new Date(album.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* === Section Blog (Bientôt disponible) dans un encadré gris === */}
      <section className="bg-gray-800 text-white py-16 px-4 mt-12 shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">NOS DERNIERS ARTICLES DE BLOG</h2>
          <p className="text-lg mb-4 max-w-3xl mx-auto leading-relaxed">
            L'histoire derrière chacune de nos photos de voyage...
          </p>
          <p className="italic mb-8">(Bientôt disponible)</p>
          <button
            type="button"
            className="border border-gray-300 text-gray-300 px-6 py-2 rounded-md transition-colors duration-300 hover:bg-gray-700 hover:border-gray-400"
            disabled
          >
            Regardez
          </button>
        </div>
      </section>

      {/* === Section Photos Récentes centrée === */}
      <section className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center tracking-tight">Dernières photos</h2>
          {/* Section descriptive pour les Dernières photos */}
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Parcourez nos dernières photos pour découvrir les moments capturés récemment, témoignant
            de notre passion et créativité.
          </p>
          <PhotoGallery />
        </div>
      </section>

      {/* === Footer minimaliste === */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} - Dany. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Bloc de style pour personnaliser les dots et ajouter un effet de texte */}
      <style>{`
        .custom-dots {
          position: absolute;
          bottom: 10px;
          width: 100%;
          display: flex !important;
          justify-content: center;
          margin: 0;
          padding: 0;
        }
        .custom-dots li button:before {
          font-size: 8px;
          color: #ccc;
          opacity: 0.8;
        }
        .custom-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }
        /* Pour donner un effet de texte plus pro sur les titres en overlay */
        .title-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
        }
      `}</style>
    </div>
  );
}

export default HomePage;
