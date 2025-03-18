// src/components/forms/ManageAlbums.jsx
import React, { useState } from 'react';
import { useAlbums } from '../../hooks/useAlbums'; // On importe le hook personnalisé
import '../../styles/styles.css';

function ManageAlbums() {
  // On récupère les albums et les fonctions de mutation via le hook useAlbums
  const { albums, isLoading, error, createAlbum, updateAlbum, deleteAlbum } = useAlbums();

  // State pour le formulaire de création d'album
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumCover, setNewAlbumCover] = useState(null);

  // State pour la modification d'un album existant
  const [editAlbumId, setEditAlbumId] = useState(null);
  const [editAlbumName, setEditAlbumName] = useState('');
  const [editAlbumDescription, setEditAlbumDescription] = useState('');
  const [editAlbumCover, setEditAlbumCover] = useState(null);

  // Fonction de création d'un album
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
      // Réinitialisation des champs après création
      setNewAlbumName('');
      setNewAlbumDescription('');
      setNewAlbumCover(null);
    }
  };

  // Préparer le formulaire de modification pour l'album sélectionné
  const handleEditAlbum = (album) => {
    setEditAlbumId(album._id);
    setEditAlbumName(album.name);
    setEditAlbumDescription(album.description || '');
    setEditAlbumCover(null);
  };

  // Mise à jour de l'album
  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editAlbumName);
    formData.append('description', editAlbumDescription);
    if (editAlbumCover) {
      formData.append('coverPhoto', editAlbumCover);
    }
    // Appel de la mutation en passant un objet contenant l'id et formData
    const result = await updateAlbum({ id: editAlbumId, formData });
    if (result.album) {
      console.log("testt")
      // Réinitialisation de l'état de modification afin de revenir à l'affichage initial ("Modifier" / "Supprimer")
      setEditAlbumId(null);
      setEditAlbumName('');
      setEditAlbumDescription('');
      setEditAlbumCover(null);
    }
  };

  // Suppression d'un album après confirmation
  const handleDeleteAlbum = async (albumId) => {
    const sure = window.confirm('Voulez-vous vraiment supprimer cet album ?');
    if (sure) {
      await deleteAlbum(albumId);
    }
  };

  // Gestion des états de chargement ou d'erreur (optionnel)
  if (isLoading) {
    return <div className="text-center text-white mt-4">Chargement...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-4">{error.message}</div>;
  }

  return (
    <div className="container-box">
      {/* Titre du formulaire d'ajout */}
      <h2 className="text-2xl font-bold mb-6">Ajouter un album</h2>

      {/* Formulaire de création d'album */}
      <form onSubmit={handleCreateAlbum} className="space-y-4 mb-8">
        <div>
          <label className="label-field">Nom de l'album</label>
          <input
            type="text"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: GR20"
          />
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea
            value={newAlbumDescription}
            onChange={(e) => setNewAlbumDescription(e.target.value)}
            className="input-field"
            placeholder="Description de l'album..."
          />
        </div>
        <div>
          <label className="label-field mb-2">Cover Photo</label>
          <div className="flex items-center space-x-4">
            {/* Label personnalisé pour l'upload de fichier */}
            <label className="file-input-label">
              <span>Choisir un fichier</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAlbumCover(e.target.files[0])}
              />
            </label>
            {/* Affichage du nom du fichier sélectionné */}
            {newAlbumCover && (
              <span className="text-sm text-gray-400">{newAlbumCover.name}</span>
            )}
          </div>
        </div>
        <button type="submit" className="button-primary w-full sm:w-auto">
          Créer l'album
        </button>
      </form>

      {/* Titre de la section de gestion */}
      <h2 className="text-2xl font-bold mb-6">Gérer les albums</h2>

      {/* Liste des albums */}
      <div className="space-y-4">
        {albums.map((album) => (
          <div
            key={album._id}
            className="border border-gray-700 p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            {editAlbumId === album._id ? (
              <form
                onSubmit={handleUpdateAlbum}
                className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center"
              >
                <input
                  type="text"
                  value={editAlbumName}
                  onChange={(e) => setEditAlbumName(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Nom de l'album"
                />
                <textarea
                  value={editAlbumDescription}
                  onChange={(e) => setEditAlbumDescription(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Description"
                />
                <label className="file-input-label">
                  <span>Changer cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditAlbumCover(e.target.files[0])}
                  />
                </label>
                <button type="submit" className="button-success">
                  Sauvegarder
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setEditAlbumId(null)}
                >
                  Annuler
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1 mb-2 sm:mb-0">
                  <h3 className="font-semibold text-lg">{album.name}</h3>
                  <p className="text-sm text-gray-300">{album.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAlbum(album)}
                    className="button-secondary"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album._id)}
                    className="button-danger"
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
