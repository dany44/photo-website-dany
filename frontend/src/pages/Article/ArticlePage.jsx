/**
 * @file ArticlePage.jsx
 * @description Page de lecture d’un article au format Markdown avec mise en forme enrichie.
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

function ArticlePage() {
  const { slug } = useParams();
  // useArticles auto-fetches when slug is provided
  const { article, isLoading, error } = useArticles({ slug });

  if (isLoading) {
    return <p className="text-center text-gray-400 mt-6">Chargement de l'article…</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 mt-6">{error.message}</p>;
  }
  if (!article) {
    return <p className="text-center text-gray-500 mt-6">Article introuvable.</p>;
  }

  const { title, markdownContent, createdAt, updatedAt, coverPhoto } = article;
  const published = new Date(createdAt).toLocaleDateString();
  const updated = updatedAt && updatedAt !== createdAt
    ? new Date(updatedAt).toLocaleDateString()
    : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 bg-gray-900 text-gray-100">
      {/* Cover image */}
      {coverPhoto && (
        <div className="overflow-hidden rounded-lg shadow-lg mb-8">
          <img
            src={coverPhoto}
            alt={title}
            className="w-full h-72 object-cover transform hover:scale-105 transition duration-500"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-300 mb-2 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-sm text-gray-400">
          Publié le {published}
          {updated && (<span> • Mis à jour le {updated}</span>)}
        </p>
      </header>

      {/* Content with enhanced markdown styling */}
      <article className="prose prose-indigo prose-invert prose-lg max-w-none space-y-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}    // ← support des images Markdown, tableaux, etc.
          rehypePlugins={[rehypeRaw]}
          skipHtml={false}              
          components={{
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-300" {...props} />
            ),
            a: ({ node, ...props }) => (
                <a className="text-indigo-400 hover:underline" {...props}>
                  {props.children || props.href}
                </a>
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-indigo-200 mt-8 mb-4" {...props}>
                  {props.children || 'Titre'}
                </h2>
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-indigo-300 mt-6 mb-3" {...props}>
                  {props.children || 'Sous-titre'}
                </h3>
              ),
              
            code: ({ node, inline, className, children, ...props }) => (
              inline ? (
                <code className="bg-gray-800 px-1 py-0.5 rounded text-indigo-200" {...props}>
                  {children}
                </code>
              ) : (
                <pre className="bg-gray-800 rounded-lg p-4 overflow-auto">
                  <code className="text-indigo-200" {...props}>{children}</code>
                </pre>
              )
            ),
            img: ({ node, ...props }) => (
                <div className="w-full mb-6 overflow-hidden rounded-lg shadow-lg aspect-video">
            <img
                {...props}
                className="
                    w-full h-full
                    object-cover       /* garde le cover */
                    object-center      /* recadrage vers le bas */
                "
                alt={props.alt || ''}
                />
            </div>
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-2 text-gray-300" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside space-y-2 text-gray-300" {...props} />
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </article>
    </main>
  );
}

export default ArticlePage;
