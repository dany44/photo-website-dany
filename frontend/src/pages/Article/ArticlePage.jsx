// src/pages/Article/ArticlePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import ReactMarkdown from 'react-markdown';

function ArticlePage() {
  const { slug } = useParams();
  const { article, isLoading, error, fetchArticleBySlug } = useArticles({ slug });

  React.useEffect(() => {
    // Refetch if slug changes
    fetchArticleBySlug(slug);
  }, [slug, fetchArticleBySlug]);

  if (isLoading) {
    return <p className="text-center text-white mt-4">Chargement de l'article...</p>;
  }
  if (error) {
    return <p className="text-center text-red-400 mt-4">{error.message}</p>;
  }
  if (!article) {
    return <p className="text-center text-gray-400 mt-4">Article introuvable.</p>;
  }

  const { title, markdownContent, createdAt, updatedAt } = article;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">{title}</h1>
      <p className="text-sm text-gray-400 mb-6 text-center">
        Publié le {formattedDate}
        {updatedAt && updatedAt !== createdAt && (
          <span> • Mis à jour le {new Date(updatedAt).toLocaleDateString()}</span>
        )}
      </p>
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </article>
    </div>
  );
}

export default ArticlePage;