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
    <div className="bg-gray-900 min-h-screen pb-8 relative">
      {/* === Carrousel pleine largeur === */}
      <div className="w-full mb-8">
        <Slider {...sliderSettings}>
          {albums.map((album) => (
            <div key={album._id}>
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
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                  <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                    {album.name}
                  </h2>
                  {album.description && (
                    <p className="text-gray-200 text-sm md:text-base max-w-lg text-center">
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
      <div className="bg-gray-800 text-white py-16 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenue</h2>
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat nunc at odio sollicitudin, in dictum sapien faucibus. Suspendisse potenti. In hac habitasse platea dictumst. Fusce vel scelerisque sapien.
          </p>
        </div>
      </div>

      {/* === Section Albums centrée === */}
      <div className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-12 text-white text-center">Portfolio</h2>
          {/* Grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <NavLink
                to={`/album/${album._id}`}
                key={album._id}
                className="group bg-gray-800 text-gray-200 rounded-md shadow-lg shadow-gray-700 overflow-hidden transform transition hover:shadow-2xl hover:shadow-gray-700 hover:-translate-y-2"
              >
                {/* Zone d'image avec ratio fixe (4/3) */}
                <div className="relative w-full aspect-[4/3]">
                  {album.coverPhoto ? (
                    <img
                      crossOrigin="anonymous"
                      src={album.coverPhoto}
                      alt={album.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Aucune couverture</span>
                    </div>
                  )}
                  {/* Overlay blanc + chevrons >> */}
                  <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:bg-opacity-40 group-hover:opacity-80">
                    <span className="text-black text-6xl font-light">»</span>
                  </div>
                </div>
                {/* Contenu texte */}
                <div className="p-4">
                  <h3 className="font-openSans text-lg font-semibold mb-1">{album.name}</h3>
                  {album.description && (
                    <p className="font-openSans text-sm text-gray-400 line-clamp-2">{album.description}</p>
                  )}
                  <p className="font-openSans italic text-xs text-gray-300 mt-2">
                    By Dany | {new Date(album.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* === Section Photos Récentes centrée === */}
      <div className="mb-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-12 text-white text-center">Dernières photos</h2>
          <PhotoGallery />
        </div>
      </div>

      {/* Bloc de style pour personnaliser les dots */}
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
          color: gray-400;
          opacity: 0.8;
        }
        .custom-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
