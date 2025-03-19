// src/pages/Album/AlbumGalleryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { useAlbums } from '../../hooks/useAlbums';

function AlbumGalleryPage() {
  const { albumId } = useParams();
  const { albums, isLoading, error } = useAlbums();

  if (isLoading) return <p className="text-center text-white mt-4">Chargement...</p>;
  if (error) return <p className="text-center text-red-400 mt-4">{error.message}</p>;

  const album = albums.find((a) => a._id === albumId);
  const albumName = album ? album.name : "Album Inconnu";

  return (
    <div className="p-4 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">{albumName}</h2>
      <PhotoGallery albumId={albumId} isAdmin={true} />
    </div>
  );
}

export default AlbumGalleryPage;
