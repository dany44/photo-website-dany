// src/components/admin/AddPhotoModal.jsx
import React, { useState } from 'react';
import { uploadPhotoToAlbum } from '../../api/photos';

function AddPhotoModal({ albumId, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('albumId', albumId);

        try {
            setLoading(true);
            await uploadPhotoToAlbum(formData);
            setLoading(false);
            setMessage('Photo ajoutée avec succès !');
            setTitle('');
            setDescription('');
            setImage(null);
            setPreview(null);
            onClose(); // Fermer le modal après succès
        } catch (err) {
            setLoading(false);
            setMessage('Erreur lors de l’ajout de la photo.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Ajouter une Photo
                </h2>

                {message && (
                    <p className="mb-4 text-center text-red-500">{message}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Titre
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="image"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                            required
                        />
                    </div>

                    {preview && (
                        <div className="mb-4">
                            <p className="text-gray-700 font-medium mb-2">
                                Aperçu :
                            </p>
                            <img
                                src={preview}
                                alt="Aperçu"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Ajout en cours...' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPhotoModal;
