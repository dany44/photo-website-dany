// src/pages/Album/AlbumGalleryPage.jsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import { AlbumContext } from '../../context/AlbumContext';

function AlbumGalleryPage() {
  const { albumId } = useParams();
  const { albums } = useContext(AlbumContext);

  const album = albums.find((a) => a._id === albumId);
  const albumName = album ? album.name : "Album Inconnu";

  return (
    <div className="p-4 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{albumName}</h2>

      {/* On injecte albumId dans PhotoGallery */}
      <PhotoGallery albumId={albumId} isAdmin={true} />
    </div>
  );
}

export default AlbumGalleryPage;
