// src/api/auth.js
import axios from './axiosInstance';

// Fonction de login
export const login = async (username, password) => {
    const response = await axios.post('/photos/login', { username, password });
    return response.data;
};

// Fonction de logout
export const logout = async () => {
    const response = await axios.post('/photos/logout');
    return response.data;
};

// Fonction pour vérifier l'authentification
export const checkAuth = async () => {
    const response = await axios.get('/photos/protected'); // Utilise la nouvelle route protégée
    return response.data;
};