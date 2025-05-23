/**
 * @file axiosInstance.js
 * @description Instance Axios configurée avec baseURL, gestion des cookies et redirection automatique sur erreur 401.
 */

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', 
    withCredentials: true, // Permet l'envoi des cookies avec les requêtes
});

// Ajouter un intercepteur de réponse
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const isLoginRequest = error.config.url === '/photos/login';
            const isHomePage = window.location.pathname === '/';
            
            if (!isLoginRequest && !isHomePage && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
