import React, { useContext, useState } from 'react';
import { AlbumContext } from '../../context/AlbumContext';
import '../../styles/styles.css';

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

  const handleEditAlbum = (album) => {
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
    <div className="container-box">
      <h2 className="text-2xl font-bold mb-4">Gérer les Albums</h2>

      {/* Formulaire de création d'album */}
      <form onSubmit={handleCreateAlbum} className="space-y-3">
        <div>
          <label className="label-field">Nom de l'album</label>
          <input type="text" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} required className="input-field" />
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea value={newAlbumDescription} onChange={(e) => setNewAlbumDescription(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field">Cover Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setNewAlbumCover(e.target.files[0])} className="input-field" />
        </div>
        <button type="submit" className="button-primary">Créer l'album</button>
      </form>

      {/* Liste des albums */}
      <div className="space-y-4 mt-6">
        {albums.map((album) => (
          <div key={album._id} className="border border-gray-700 p-4 rounded flex justify-between items-center">
            {editAlbumId === album._id ? (
              <form onSubmit={handleUpdateAlbum} className="flex-1 flex space-x-2 items-center">
                <input type="text" value={editAlbumName} onChange={(e) => setEditAlbumName(e.target.value)} className="input-field flex-1" />
                <textarea value={editAlbumDescription} onChange={(e) => setEditAlbumDescription(e.target.value)} className="input-field flex-1" />
                <input type="file" accept="image/*" onChange={(e) => setEditAlbumCover(e.target.files[0])} className="input-field" />
                <button type="submit" className="button-success">Sauvegarder</button>
                <button type="button" className="button-secondary" onClick={() => setEditAlbumId(null)}>Annuler</button>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{album.name}</h3>
                  <p className="text-sm text-gray-300">{album.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditAlbum(album)} className="button-secondary">Modifier</button>
                  <button onClick={() => handleDeleteAlbum(album._id)} className="button-danger">Supprimer</button>
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