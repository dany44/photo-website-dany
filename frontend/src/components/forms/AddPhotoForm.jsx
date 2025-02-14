// AddPhotoForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { uploadPhoto } from '../../api/photos';
import { AlbumContext } from '../../context/AlbumContext';

function AddPhotoForm() {
  // Récupère la liste des albums depuis le context
  const { albums, fetchAlbums } = useContext(AlbumContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Nouvel état pour stocker l’album sélectionné
  const [selectedAlbum, setSelectedAlbum] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const [loading, setLoading] = useState(false);

  // Au montage, s'assurer d'avoir la liste des albums
  useEffect(() => {
    fetchAlbums(); 
    // eslint-disable-next-line
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
    if (!image) {
      setMessage('Veuillez sélectionner une image.');
      setMessageType('error');
      return;
    }
    if (!selectedAlbum) {
      setMessage('Veuillez sélectionner un album.');
      setMessageType('error');
      return;
    }

    // Construction du FormData pour l’upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('albumId', selectedAlbum); // Ajout de l’albumId

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
    } catch (err) {
      setLoading(false);
      setMessage('Erreur lors de l’ajout de la photo.');
      setMessageType('error');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg text-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter une Nouvelle Photo</h2>
      
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded relative ${
            messageType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
            'bg-red-100 border border-red-400 text-red-700'
          }`}
          role="alert"
        >
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Entrez le titre de la photo"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Entrez une description de la photo"
            rows="4"
            required
          />
        </div>

        {/* Sélecteur d'album */}
        <div>
          <label htmlFor="albumSelect" className="block text-gray-700 font-medium mb-2">Album</label>
          <select
            id="albumSelect"
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-700"
            required
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">Aperçu de l'image :</p>
            <img src={preview} alt="Aperçu" className="w-full h-auto rounded-lg" />
          </div>
        )}

        {/* Bouton Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : null}
          {loading ? 'Téléchargement...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

export default AddPhotoForm;
