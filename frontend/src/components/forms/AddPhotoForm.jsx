// src/components/forms/AddPhotoForm.jsx
import React, { useState, useEffect } from 'react';
import { uploadPhoto } from '../../api/photos';
import { useAlbums } from '../../hooks/useAlbums';
import '../../styles/styles.css';

function AddPhotoForm() {
  const { albums, isLoading, error } = useAlbums();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Avec React Query, le hook useAlbums s'occupe du fetch, donc pas besoin de fetchAlbums ici
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !selectedAlbum) {
      setMessage(!image ? 'Veuillez sélectionner une image.' : 'Veuillez sélectionner un album.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('albumId', selectedAlbum);

    try {
      setLoading(true);
      await uploadPhoto(formData);
      setLoading(false);
      setMessage('Photo ajoutée avec succès !');
      setMessageType('success');
      setTitle('');
      setDescription('');
      setImage(null);
      setPreview(null);
      setSelectedAlbum('');
    } catch {
      setLoading(false);
      setMessage('Erreur lors de l’ajout de la photo.');
      setMessageType('error');
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div className="container-box">
      <h2 className="text-2xl font-bold mb-6">Ajouter une Nouvelle Photo</h2>

      {message && (
        <div className={messageType === 'success' ? 'message-success' : 'message-error'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="label-field">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Ex: Paysage urbain"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="label-field">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            rows="4"
            placeholder="Description de la photo..."
            required
          />
        </div>
        <div>
          <label htmlFor="albumSelect" className="label-field">Album</label>
          <select
            id="albumSelect"
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="input-field"
            required
          >
            <option value="">-- Sélectionnez un album --</option>
            {albums.map((album) => (
              <option key={album._id} value={album._id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="label-field mb-2">Image</label>
          <div className="flex items-center space-x-4">
            <label className="file-input-label">
              <span>Choisir un fichier</span>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
            {image && <span className="text-sm text-gray-400">{image.name}</span>}
          </div>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-auto rounded-lg border border-gray-600 shadow-sm"
          />
        )}
        <button type="submit" className="button-primary w-full sm:w-auto" disabled={loading}>
          {loading ? 'Téléchargement...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

export default AddPhotoForm;
