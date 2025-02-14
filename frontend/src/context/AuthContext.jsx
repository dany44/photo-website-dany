// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { checkAuth, login as loginApi, logout as logoutApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Indique si l'authentification est en cours
    const [error, setError] = useState(null); // Pour capturer les erreurs d'authentification

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        // Ne pas vérifier l'authentification si on est déjà sur la page de login
        if (window.location.pathname !== '/login') {
            verifyAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            await loginApi(username, password);
            setIsAuthenticated(true);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
            setIsAuthenticated(false);
            return { success: false, message: err.response?.data?.message || 'Erreur de connexion' };
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
            setIsAuthenticated(false);
            setError(null);
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
            setError('Erreur lors de la déconnexion.');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
