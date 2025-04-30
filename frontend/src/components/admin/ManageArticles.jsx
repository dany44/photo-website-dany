import React, { useState, useEffect } from 'react';
import { useArticles } from '../../hooks/useArticles';
import '../../styles/styles.css';

function ManageArticles() {
    // Utilise le hook pour gérer les articles
    const {
        articles,
        isLoading,
        error,
        upload,
        deleteArticle,
    } = useArticles();

    // États du formulaire
    const [selectedSlug, setSelectedSlug] = useState('');
    const [mdFile, setMdFile] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // "success" ou "error"

    // Gérer l'upload (création ou remplacement)
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!mdFile) {
            setMessage('Veuillez sélectionner un fichier .md.');
            setMessageType('error');
            return;
        }
        try {
            setMessage('');
            await upload(mdFile);
            setMessage('Article publié avec succès.');
            setMessageType('success');
            setMdFile(null);
        } catch (err) {
            const serverMsg = err.response?.data?.message || 'Erreur lors de la publication.';
            setMessage(serverMsg);
            setMessageType('error');
        }
    };

    // Gérer la suppression
    const handleDelete = async () => {
        if (!selectedSlug) {
            setMessage('Veuillez sélectionner un article.');
            setMessageType('error');
            return;
        }
        const confirmDel = window.confirm('Supprimer cet article ?');
        if (!confirmDel) return;
        try {
            await deleteArticle(selectedSlug);
            setMessage('Article supprimé.');
            setMessageType('success');
            setSelectedSlug('');
        } catch (err) {
            const serverMsg = err.response?.data?.message || 'Erreur lors de la suppression.';
            setMessage(serverMsg);
            setMessageType('error');
        }
    };

    if (isLoading) return <p className="text-white text-center">Chargement des articles...</p>;
    if (error) return <p className="text-red-400 text-center">{error.message}</p>;

    return (
        <div className="container-box space-y-6">
            <h2 className="text-2xl font-bold">Gérer les articles</h2>

            {message && (
                <div className={messageType === 'success' ? 'message-success' : 'message-error'}>
                    {message}
                </div>
            )}

            {/* Section création / upload */}
            <form onSubmit={handleUpload} className="space-y-4">
                <label className="label-field">Publier un nouvel article (Markdown)</label>
                <label className="file-input-label">
                    <span>Choisir un fichier</span>
                    <input
                        type="file"
                        accept=".md"
                        required
                        onChange={(e) => setMdFile(e.target.files[0])}
                    />
                </label>
                <span className="text-sm text-gray-400 ml-4">
                    {mdFile ? mdFile.name : 'Aucun fichier sélectionné'}
                </span>
                <button type="submit" className="button-primary">
                    Publier
                </button>
            </form>

            {/* Section suppression / édition */}
            <div className="space-y-2">
                <label className="label-field">Sélectionner un article pour le supprimer</label>
                <select
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="input-field"
                >
                    <option value="">-- Choisir un article --</option>
                    {articles.map((art) => (
                        <option key={art.slug} value={art.slug}>
                            {art.title}
                        </option>
                    ))}
                </select>
                <button onClick={handleDelete} className="button-danger">
                    Supprimer
                </button>
            </div>
        </div>
    );
}

export default ManageArticles;