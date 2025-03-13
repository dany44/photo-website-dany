import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AddPhotoForm from '../../components/forms/AddPhotoForm';
import PhotoGallery from '../../components/gallery/PhotoGallery';
import ManageAlbums from '../../components/admin/ManageAlbums';

function AdminPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('albums');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="text-white text-center mt-20">Chargement en cours...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white text-center">Espace Admin</h2>
      
      {/* Onglets */}
      <div className="flex border-b border-gray-700 mb-4">
        {['albums', 'photos', 'gallery'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center text-white ${activeTab === tab ? 'border-b-2 border-blue-500 font-bold' : 'opacity-50'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'albums' ? 'Gérer Albums' : tab === 'photos' ? 'Ajouter Photo' : 'Galerie'}
          </button>
        ))}
      </div>

      {/* Contenu de l’onglet actif */}
      {activeTab === 'albums' && <ManageAlbums />}
      {activeTab === 'photos' && <AddPhotoForm />}
      {activeTab === 'gallery' && <PhotoGallery isAdmin />}
    </div>
  );
}

export default AdminPage;