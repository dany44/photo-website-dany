/**
 * @file LoginPage.jsx
 * @description Page de connexion pour administrateurs, avec redirection automatique si déjà connecté.
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginForm from '../../components/forms/LoginForm';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);
    const [error, setError] = useState('');

    useEffect(() => {
        // Si déjà authentifié, rediriger vers /admin
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (username, password) => {
        const result = await login(username, password);
        if (result.success) {
            setError('');
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <LoginForm onSubmit={handleLogin} error={error} />
        </div>
    );
}

export default LoginPage;
