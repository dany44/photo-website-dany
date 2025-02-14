// src/pages/Album/AlbumGalleryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PhotoGallery from '../../components/gallery/PhotoGallery';

function AlbumGalleryPage() {
  const { albumId } = useParams();

  return (
    <div className="p-4 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Album</h2>

      {/* On injecte albumId dans PhotoGallery */}
      <PhotoGallery albumId={albumId} isAdmin={true} />
      {/* 
         - "isAdmin" selon tes besoins, 
         - Par ex. si l’utilisateur est vraiment admin
           tu peux récupérer ça depuis AuthContext au lieu 
           de mettre isAdmin={true} en dur.
      */}
    </div>
  );
}

export default AlbumGalleryPage;
