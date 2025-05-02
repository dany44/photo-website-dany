/**
 * @file photos.js
 * @description Fonctions API pour gérer les photos : upload, récupération paginée, suppression.
 */

import axiosInstance from './axiosInstance';

// Récupère les photos avec pagination
export async function getPhotos(page = 1, limit = 25) {
  const response = await axiosInstance.get(`/photos?page=${page}&limit=${limit}`);
  return response.data; 
  // { photos, currentPage, totalPages, ... }
}

// Supprime une photo
export async function deletePhoto(id) {
  const response = await axiosInstance.delete(`/photos/${id}`);
  return response.data;
}

// Upload une photo
export async function uploadPhoto(formData) {
  const response = await axiosInstance.post('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
