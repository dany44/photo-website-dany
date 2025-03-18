import React, { useState } from 'react';

function LoginForm({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="container-box max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="message-error" role="alert">
            <span>{error}</span>
          </div>
        )}
        <div>
          <label htmlFor="username" className="label-field">
            Utilisateur
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            placeholder="Entrez votre nom d'utilisateur"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="label-field">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button
          type="submit"
          className="button-primary"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
