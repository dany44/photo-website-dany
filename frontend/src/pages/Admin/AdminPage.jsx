// src/pages/Admin/AdminPage.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AddPhotoForm from '../../components/forms/AddPhotoForm';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import ManageAlbums from '../../components/admin/ManageAlbums'; // << Import du composant

function AdminPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="text-white text-center mt-20">Chargement en cours...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Espace Admin</h2>
      
      {/* Gérer les albums */}
      <ManageAlbums />

      {/* Formulaire d’ajout de photo */}
      <AddPhotoForm />

      {/* Galerie de toutes les photos */}
      <PhotoGallery isAdmin />
    </div>
  );
}

export default AdminPage;
