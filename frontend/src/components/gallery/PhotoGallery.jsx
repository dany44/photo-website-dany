// src/components/gallery/PhotoGallery.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getPhotos, deletePhoto } from '../../api/photos';
import { getAlbumById } from '../../api/albums';

function PhotoGallery({ albumId, isAdmin = false }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');

  // Pagination (pour la vue globale)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Index de la photo sélectionnée (pour le modal)
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  // Refs pour le modal "ruban"
  const scrollContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  // useEffect : charger les photos différemment selon albumId
  useEffect(() => {
    fetchPhotos(currentPage);
    // eslint-disable-next-line
  }, [albumId, currentPage]);

  const fetchPhotos = async (page) => {
    try {
      setError('');

      if (albumId) {
        // Récupération des photos d'un album spécifique
        const data = await getAlbumById(albumId);
        const album = data.album;
        if (!album) {
          setError('Album introuvable.');
          return;
        }
        // Pas de pagination "globale" ici : on récupère tout l'album
        setPhotos(album.photos || []);
        setTotalPages(1); 
        setCurrentPage(1); 
      } else {
        // Récupération de TOUTES les photos (avec pagination)
        const data = await getPhotos(page, 10); // 10 photos/page
        setPhotos(data.photos);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des photos.');
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression de la photo.');
    }
  };

  const handleDeletePhoto = (e, id) => {
    e.stopPropagation();
    handleDelete(id);
  };

  // Modal
  const handleOpenModal = (index) => {
    setSelectedIndex(index);
  };
  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  // Clic sur miniature -> scroller le ruban
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

  // Rendu
  return (
    <div className="p-4">
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Galerie (masonry) */}
      <div className="columns-1 md:columns-3 xl:columns-5 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo._id}
            onClick={() => handleOpenModal(index)}
            className="mb-4 break-inside-avoid relative group cursor-pointer"
          >
            <img
              crossOrigin="anonymous"
              src={
                photo.signedUrl?.startsWith('/')
                  ? `http://localhost:3000${photo.signedUrl}`
                  : photo.signedUrl
              }
              alt={photo.title}
              className="
                w-full h-auto
                object-cover
                rounded
                transition-all duration-300
                group-hover:scale-105
                group-hover:brightness-110
              "
            />
            {/* Bouton supprimer si admin/auth */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={(e) => handleDeletePhoto(e, photo._id)}
                className="
                  absolute top-2 right-2
                  bg-red-600 text-white px-2 py-1 text-sm
                  rounded opacity-0 group-hover:opacity-100
                  transition
                "
              >
                Suppr
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination (uniquement si on n'a pas d'albumId) */}
      {!albumId && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80"
          onClick={handleCloseModal}
        >
          {/* Bouton fermer */}
          <button
            onClick={handleCloseModal}
            className="
              text-white text-2xl
              absolute top-4 right-4
              bg-gray-700 hover:bg-gray-600
              rounded-full w-10 h-10
              flex items-center justify-center
              z-10
            "
          >
            ✕
          </button>

          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo principale */}
            <div
              className="
                absolute top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                max-w-[23vw] max-h-[23vh]
                flex items-center justify-center
              "
            >
              <img
                crossOrigin="anonymous"
                src={
                  selectedPhoto.signedUrl?.startsWith('/')
                    ? `http://localhost:3000${selectedPhoto.signedUrl}`
                    : selectedPhoto.signedUrl
                }
                alt={selectedPhoto.title}
                className="
                  object-contain
                  max-w-full max-h-full
                "
              />
            </div>

            {/* Titre + description à droite */}
            <div
              className="
                absolute top-1/2 right-10
                -translate-y-1/2
                text-white w-48
              "
            >
              <h3 className="text-lg font-bold mb-1">{selectedPhoto.title}</h3>
              <p className="text-sm text-gray-300">
                {selectedPhoto.description}
              </p>
            </div>

            {/* Ruban en bas */}
            <div
              ref={scrollContainerRef}
              className="
                absolute bottom-0 left-0 right-0
                h-24 bg-black bg-opacity-90
                flex items-center
                px-2
                overflow-x-auto
                whitespace-nowrap
              "
            >
              {photos.map((thumb, idx) => (
                <div
                  key={thumb._id}
                  ref={(el) => (thumbnailRefs.current[idx] = el)}
                  className={`
                    cursor-pointer mr-2
                    w-20 h-full
                    flex-shrink-0 border-2
                    ${
                      idx === selectedIndex
                        ? 'border-white'
                        : 'border-transparent'
                    }
                    hover:border-white
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThumbnailClick(idx);
                  }}
                >
                  <img
                    crossOrigin="anonymous"
                    src={
                      thumb.signedUrl?.startsWith('/')
                        ? `http://localhost:3000${thumb.signedUrl}`
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
