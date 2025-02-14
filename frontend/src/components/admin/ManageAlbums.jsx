// src/components/admin/ManageAlbums.jsx
import React, { useContext, useState } from 'react';
import { AlbumContext } from '../../context/AlbumContext';

function ManageAlbums() {
  const { albums, createAlbum, updateAlbum, deleteAlbum } = useContext(AlbumContext);

  // States pour le form de création
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState(null);

  // States pour la modification
  const [editAlbumId, setEditAlbumId] = useState(null);
  const [editAlbumName, setEditAlbumName] = useState('');
  const [editAlbumDescription, setEditAlbumDescription] = useState('');
  const [editAlbumCover, setEditAlbumCover] = useState(null);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newAlbumName);
    formData.append('description', newAlbumDescription);
    if (newAlbumCover) {
      formData.append('coverPhoto', newAlbumCover);
    }
    const result = await createAlbum(formData);
    if (result.success) {
      setNewAlbumName('');
      setNewAlbumDescription('');
      setNewAlbumCover(null);
    }
  };

  const handleEditAlbum = async (album) => {
    setEditAlbumId(album._id);
    setEditAlbumName(album.name);
    setEditAlbumDescription(album.description || '');
    setEditAlbumCover(null);
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editAlbumName);
    formData.append('description', editAlbumDescription);
    if (editAlbumCover) {
      formData.append('coverPhoto', editAlbumCover);
    }
    const result = await updateAlbum(editAlbumId, formData);
    if (result.success) {
      // Réinitialiser le formulaire
      setEditAlbumId(null);
      setEditAlbumName('');
      setEditAlbumDescription('');
      setEditAlbumCover(null);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    const sure = window.confirm('Voulez-vous vraiment supprimer cet album ?');
    if (sure) {
      await deleteAlbum(albumId);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Gérer les Albums</h2>

      {/* Formulaire de création d'album */}
      <form onSubmit={handleCreateAlbum} className="mb-6 space-y-3">
        <div>
          <label className="block font-medium">Nom de l'album</label>
          <input
            type="text"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            required
            className="w-full px-2 py-1 rounded text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={newAlbumDescription}
            onChange={(e) => setNewAlbumDescription(e.target.value)}
            className="w-full px-2 py-1 rounded text-black"
          />
        </div>
        <div>
          <label className="block font-medium">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewAlbumCover(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Créer l'album
        </button>
      </form>

      {/* Liste des albums */}
      <div className="space-y-4">
        {albums.map((album) => (
          <div
            key={album._id}
            className="border border-gray-700 p-4 rounded flex justify-between items-center"
          >
            {/* Si on est en mode édition pour cet album */}
            {editAlbumId === album._id ? (
              <form
                onSubmit={handleUpdateAlbum}
                className="flex-1 flex space-x-2 items-center"
              >
                <input
                  type="text"
                  value={editAlbumName}
                  onChange={(e) => setEditAlbumName(e.target.value)}
                  className="px-2 py-1 rounded text-black flex-1"
                />
                <textarea
                  value={editAlbumDescription}
                  onChange={(e) => setEditAlbumDescription(e.target.value)}
                  className="px-2 py-1 rounded text-black flex-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditAlbumCover(e.target.files[0])}
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  className="bg-gray-600 text-white px-2 py-1 rounded"
                  onClick={() => setEditAlbumId(null)}
                >
                  Annuler
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{album.name}</h3>
                  <p className="text-sm text-gray-300">{album.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAlbum(album)}
                    className="bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageAlbums;
