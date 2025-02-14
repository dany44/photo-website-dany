// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import AdminPage from '../pages/Admin/AdminPage';
import LoginPage from '../pages/Login/LoginPage';
import AboutPage from '../pages/About/AboutPage';
import AlbumGalleryPage from '../pages/Album/AlbumGalleryPage'; 

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/album/:albumId" element={<AlbumGalleryPage />} />

      {/* Ajoute d'autres routes au besoin */}
    </Routes>
  );
}

export default AppRoutes;
