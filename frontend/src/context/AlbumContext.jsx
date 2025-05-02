/**
 * @file AuthContext.jsx
 * @description Fournit un contexte d’authentification global : état de session, login, logout, vérification initiale.
 */
import React, { createContext, useState, useEffect } from 'react';
import {
  getAllAlbums,
  createAlbum as createAlbumApi,
  updateAlbum as updateAlbumApi,
  deleteAlbum as deleteAlbumApi,
} from '../api/albums';

export const AlbumContext = createContext();

export function AlbumProvider({ children }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les albums au montage
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await getAllAlbums();
      setAlbums(data.albums);
    } catch (err) {
      setError('Erreur lors de la récupération des albums.');
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async (formData) => {
    try {
      setLoading(true);
      const { album } = await createAlbumApi(formData);
      setAlbums((prev) => [...prev, album]);
      return { success: true, album };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Erreur lors de la création.' };
    } finally {
      setLoading(false);
    }
  };

  const updateAlbum = async (id, formData) => {
    try {
      setLoading(true);
      const { album } = await updateAlbumApi(id, formData);
      setAlbums((prev) => prev.map((a) => (a._id === id ? album : a)));
      return { success: true, album };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Erreur lors de la mise à jour.' };
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (id) => {
    try {
      setLoading(true);
      await deleteAlbumApi(id);
      setAlbums((prev) => prev.filter((a) => a._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Erreur lors de la suppression.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlbumContext.Provider
      value={{
        albums,
        loading,
        error,
        fetchAlbums,
        createAlbum,
        updateAlbum,
        deleteAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}
