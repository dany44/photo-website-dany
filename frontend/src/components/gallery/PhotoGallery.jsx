/**
 * @file PhotoGallery.jsx
 * @description Galerie de photos affichée en grid ou slider, avec vue modale et pagination selon le contexte.
 */

import React, { useState, useRef, useEffect } from 'react';
import Slider from "react-slick";
import { AuthContext } from '../../context/AuthContext';
import { usePhotos } from '../../hooks/usePhotos';
import { useAlbumPhotos } from '../../hooks/useAlbumPhotos';

function PhotoGallery({ albumId, isAdmin = false }) {
  const { isAuthenticated } = React.useContext(AuthContext);

  // Pour la vue globale (non album), on utilise une state pour la page
  const [page, setPage] = useState(1);

  // Hooks pour récupérer les photos
  const albumQuery = useAlbumPhotos(albumId);
  const photosQuery = usePhotos(page, 10, { enabled: !albumId });

  // Déterminer la vue à utiliser : album spécifique ou globale.
  const isAlbumView = Boolean(albumId);

  // Composant flèche de droite
  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-white text-4xl cursor-pointer z-10`}
        style={{
          ...style,
          right: '-20px',
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
          left: '-20px',
          zIndex: 1,
        }}
        onClick={onClick}
      />
    );
  }

  // Extraction des données
  const {
    photos,
    currentPage,
    totalPages,
    isLoading,
    error,
    deletePhoto,
  } = isAlbumView
      ? {
        photos: albumQuery.data?.album?.photos || [],
        currentPage: 1,
        totalPages: 1,
        isLoading: albumQuery.isLoading,
        error: albumQuery.error,
        // Pour une vue d'album, la suppression peut être désactivée ou gérée différemment.
        deletePhoto: () => { },
      }
      : {
        photos: photosQuery.photos,
        currentPage: photosQuery.currentPage,
        totalPages: photosQuery.totalPages,
        isLoading: photosQuery.isLoading,
        error: photosQuery.error,
        deletePhoto: photosQuery.deletePhoto,
      };

  // Modal & miniatures
  const [selectedIndex, setSelectedIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  // Ref pour le slider
  const sliderRef = useRef(null);

  // Forcer la position du slider après chargement/MAJ des photos
  useEffect(() => {
    if (sliderRef.current && photos.length > 0) {
      // Laisser un léger délai pour que la mise en page soit stabilisée
      setTimeout(() => {
        sliderRef.current.slickGoTo(0);
      }, 50);
    }
  }, [photos]);

  // Configuration du slider : on évite d'afficher plus de slides que le nombre de photos
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: photos.length > 0 ? Math.min(photos.length, 5) : 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: photos.length > 0 ? Math.min(photos.length, 3) : 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: photos.length > 0 ? Math.min(photos.length, 2) : 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Gestion de l'ouverture/fermeture du modal
  const handleOpenModal = (index) => setSelectedIndex(index);
  const handleCloseModal = () => setSelectedIndex(null);

  // Scroll horizontal dans le ruban de miniatures
  const handleThumbnailClick = (idx) => {
    setSelectedIndex(idx);
    if (!scrollContainerRef.current || !thumbnailRefs.current[idx]) return;
    const container = scrollContainerRef.current;
    const thumbnail = thumbnailRefs.current[idx];
    const offsetLeft = thumbnail.offsetLeft;
    const halfContainerWidth = container.clientWidth / 2;
    const halfThumbWidth = thumbnail.clientWidth / 2;
    const scrollPosition = offsetLeft + halfThumbWidth - halfContainerWidth;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  // Suppression de photo (admin)
  const handleDeletePhoto = (e, id) => {
    e.stopPropagation();
    deletePhoto(id);
  };

  // Pagination (admin)
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-0">
      {error && <p className="text-red-400 mb-4">{error.message}</p>}
      {isLoading && <p className="text-white">Chargement...</p>}

      {isAlbumView ? (
        // Affichage d'un album spécifique
        photos.length === 0 ? (
          <p className="text-white text-center py-6">
            Aucune photo n'est disponible dans cet album pour le moment.
          </p>
        ) : (
          <div className="columns-2 md:columns-3 xl:columns-3 gap-2">
            {photos.map((photo, index) => (
              <div
                key={photo._id}
                onClick={() => handleOpenModal(index)}
                className="mb-2 break-inside-avoid relative group cursor-pointer"
              >
                <img
                  crossOrigin="anonymous"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  src={
                    photo.signedUrl?.startsWith('/')
                      ? `${process.env.REACT_APP_API_URL}${photo.signedUrl}`
                      : photo.signedUrl
                  }
                  alt={photo.title}
                  className="w-full h-auto object-cover rounded transition-all duration-300 group-hover:scale-102 group-hover:brightness-110"
                />
                {isAuthenticated && isAdmin && (
                  <button
                    onClick={(e) => handleDeletePhoto(e, photo._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Suppr
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        // Vue globale
        isAdmin ? (
          // Pour un admin, affichage en masonry + pagination
          <>
            <div className="columns-3 md:columns-3 xl:columns-5 gap-2">
              {photos.map((photo, index) => (
                <div
                  key={photo._id}
                  onClick={() => handleOpenModal(index)}
                  className="mb-2 break-inside-avoid relative group cursor-pointer"
                >
                  <img
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    crossOrigin="anonymous"
                    src={
                      photo.signedUrl?.startsWith('/')
                        ? `${process.env.REACT_APP_API_URL}${photo.signedUrl}`
                        : photo.signedUrl
                    }
                    alt={photo.title}
                    className="w-full h-auto object-cover rounded transition-all duration-300 group-hover:scale-102 group-hover:brightness-110"
                  />
                  {isAuthenticated && isAdmin && (
                    <button
                      onClick={(e) => handleDeletePhoto(e, photo._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Suppr
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-6 space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="px-2 py-1 border border-gray-600 rounded disabled:opacity-50 sm:px-4 sm:py-2 md:px-5 md:py-2.5"
              >
                Précédent
              </button>
              <span className="text-sm sm:text-base md:text-lg">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="px-2 py-1 border border-gray-600 rounded disabled:opacity-50 sm:px-4 sm:py-2 md:px-5 md:py-2.5"
              >
                Suivant
              </button>
            </div>
          </>
        ) : (
          // Pour un utilisateur non-admin, slider horizontal avec react-slick
          <Slider ref={sliderRef} {...sliderSettings}>
            {photos.map((photo, index) => (
              <div
                key={photo._id}
                onClick={() => handleOpenModal(index)}
                className="relative group cursor-pointer p-2"
              >
                <img
                  crossOrigin="anonymous"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  src={
                    photo.signedUrl?.startsWith('/')
                      ? `${process.env.REACT_APP_API_URL}${photo.signedUrl}`
                      : photo.signedUrl
                  }
                  alt={photo.title}
                  className="w-full h-auto object-cover rounded transition-all duration-300 group-hover:scale-102 group-hover:brightness-110"
                />
              </div>
            ))}
          </Slider>
        )
      )}

      {/* Modal de visualisation */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80"
          onClick={handleCloseModal}
        >
          <button
            onClick={handleCloseModal}
            className="text-white text-2xl absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            ✕
          </button>
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[50vh] sm:w-[80vw] sm:h-[60vh] md:w-[70vw] md:h-[70vh] lg:w-[55vw] lg:h-[75vh] xl:w-[45vw] xl:h-[85vh] flex items-center justify-center">
              <img
                crossOrigin="anonymous"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                src={
                  selectedPhoto.signedUrl?.startsWith('/')
                    ? `${process.env.REACT_APP_API_URL}${selectedPhoto.signedUrl}`
                    : selectedPhoto.signedUrl
                } 
                alt={selectedPhoto.title}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="absolute top-[78%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] text-white text-center 
                  sm:top-[78%] sm:left-1/2 sm:text-center 
                  md:top-1/2 md:left-auto md:right-10 md:translate-x-0 md:w-48 md:text-left
                  lg:top-1/2 lg:left-auto lg:right-40 lg:translate-x-0 lg:w-48 lg:text-left">  
              <h3 className="text-lg font-bold mb-1">{selectedPhoto.title}</h3>
              <p className="text-sm text-gray-300">{selectedPhoto.description}</p>
            </div>

            {/* Ruban de miniatures en bas du modal */}
            <div
              ref={scrollContainerRef}
              className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-black bg-opacity-90 flex items-center px-2 overflow-x-auto whitespace-nowrap"
            >
              {photos.map((thumb, idx) => (
                <div
                  key={thumb._id}
                  ref={(el) => (thumbnailRefs.current[idx] = el)}
                  className={`cursor-pointer mr-2 w-16 h-[90%] sm:w-20 md:w-24 flex-shrink-0 border-2 ${idx === selectedIndex ? 'border-white' : 'border-transparent'
                    } hover:border-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThumbnailClick(idx);
                  }}
                >
                  <img
                    crossOrigin="anonymous"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    src={
                      thumb.signedUrl?.startsWith('/')
                        ? `${process.env.REACT_APP_API_URL}${thumb.signedUrl}`
                        : thumb.signedUrl
                    }
                    alt={thumb.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;