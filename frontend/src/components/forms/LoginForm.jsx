// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';

function LoginForm({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-gray-700 bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Entrez votre nom d'utilisateur"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
