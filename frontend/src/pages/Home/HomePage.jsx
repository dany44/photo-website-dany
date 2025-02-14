// src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { getAllAlbums } from '../../api/albums'; // ou import { useContext } from 'react' + AlbumContext
import { NavLink } from 'react-router-dom';

function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Charger la liste des albums
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await getAllAlbums(); // { albums: [...] }
      setAlbums(data.albums);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des albums.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white mt-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-4">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Accueil</h1>
      
      {/* Section Albums */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Albums</h2>
        
        {/* Grille responsive pour afficher les albums */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <NavLink
              to={`/album/${album._id}`}
              key={album._id}
              className="bg-gray-800 rounded shadow p-4 flex flex-col
                         hover:bg-gray-700 transition-colors"
            >
              {/* CoverPhoto si elle existe, sinon un placeholder */}
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

      {/* Section Photos récentes */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Photos Récentes</h2>
        <PhotoGallery />
      </div>
    </div>
  );
}

export default HomePage;
