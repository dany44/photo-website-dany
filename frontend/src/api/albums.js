// src/api/albums.js
import axiosInstance from './axiosInstance';

// Récupère tous les albums
export async function getAllAlbums() {
  const response = await axiosInstance.get('/albums');
  return response.data; 
  // { albums: [...] }
}

// Récupère un album par ID
export async function getAlbumById(id) {
  const response = await axiosInstance.get(`/albums/${id}`);
  return response.data;
  // { album: {...} }
}

// Crée un nouvel album (avec ou sans coverPhoto)
export async function createAlbum(formData) {
  // formData peut contenir name, description, et coverPhoto
  const response = await axiosInstance.post('/albums', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
  // { message, album: {...} }
}

// Met à jour un album
export async function updateAlbum(id, formData) {
  // formData peut contenir name, description, et coverPhoto
  const response = await axiosInstance.put(`/albums/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
  // { message, album: {...} }
}

// Supprime un album
export async function deleteAlbum(id) {
  const response = await axiosInstance.delete(`/albums/${id}`);
  return response.data;
  // { message }
}

// Ajouter une photo existante à un album
export async function addPhotoToAlbum(albumId, photoId) {
  const response = await axiosInstance.post('/albums/add-photo', { albumId, photoId });
  return response.data;
  // { message, album }
}

// Déplacer une photo d’un album à un autre
export async function movePhotoToAlbum(fromAlbumId, toAlbumId, photoId) {
  const response = await axiosInstance.post('/albums/move-photo', {
    fromAlbumId,
    toAlbumId,
    photoId
  });
  return response.data;
  // { message, fromAlbum, toAlbum }
}
