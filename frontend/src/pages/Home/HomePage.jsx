// src/pages/Home/HomePage.jsx
import React from 'react';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { NavLink } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';

function HomePage() {
  // On récupère les albums avec le hook personnalisé
  const { albums, isLoading, error } = useAlbums();

  if (isLoading) {
    return <div className="text-center text-white mt-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-4">{error.message}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      {/* Section Albums */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <NavLink
              to={`/album/${album._id}`}
              key={album._id}
              className="bg-gray-800 rounded shadow p-4 flex flex-col hover:bg-gray-700 transition-colors"
            >
              {album.coverPhoto ? (
                <img
                  crossOrigin="anonymous"
                  src={album.coverPhoto}
                  alt={album.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center mb-2 rounded">
                  <span className="text-gray-400 text-sm">Aucune couverture</span>
                </div>
              )}
              <h3 className="text-lg font-bold">{album.name}</h3>
              {album.description && (
                <p className="text-gray-300 text-sm mt-1">{album.description}</p>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Section Photos Récentes */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Photos Récentes</h2>
        <PhotoGallery />
      </div>
    </div>
  );
}

export default HomePage;
