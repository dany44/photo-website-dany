// src/pages/Login/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginForm from '../../components/forms/LoginForm';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);
    const [error, setError] = useState('');

    const handleLogin = async (username, password) => {
        const result = await login(username, password);
        if (result.success) {
            setError('');
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    // Si déjà authentifié, rediriger vers /admin
    if (isAuthenticated) {
        navigate('/admin');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <LoginForm onSubmit={handleLogin} error={error} />
        </div>
    );
}

export default LoginPage;
