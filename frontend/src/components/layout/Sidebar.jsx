/**
 * @file Sidebar.jsx
 * @description Barre latérale de navigation responsive avec liens vers le portfolio, blog, contact et admin.
 */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlbums } from "../../hooks/useAlbums";
import { useArticles } from "../../hooks/useArticles";
import { FaChevronDown, FaChevronUp, FaInstagram, FaFlickr, Fa500Px } from "react-icons/fa";

const Sidebar = ({ closeSidebar }) => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const { albums, isLoading: isLoadingAlbums } = useAlbums();
  const { articles, isLoading: isLoadingArticles } = useArticles();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);

  const handleNavigation = () => {
    if (window.innerWidth < 768) closeSidebar();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-black text-gray-200 flex flex-col shadow-lg z-50">
      {/* Logo */}
      <div className="mt-8 mb-6 px-6 text-center">
        <div className="text-white font-signature text-5xl leading-snug">
          Dany<br />Khadhar
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center space-x-4 mb-6">
        <a href="https://www.instagram.com/danykhadhar" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white text-xl hover:text-indigo-400" />
        </a>
        <a href="https://www.flickr.com/photos/danykhadhar" target="_blank" rel="noopener noreferrer">
          <FaFlickr className="text-white text-xl hover:text-indigo-400" />
        </a>
        <a href="https://500px.com/danykhadhar" target="_blank" rel="noopener noreferrer">
          <Fa500Px className="text-white text-xl hover:text-indigo-400" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-none text-sm">
        {/* Accueil */}
        <NavLink
          to="/"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `block px-6 py-3 font-medium tracking-wide uppercase ${isActive ? "text-indigo-400" : "hover:text-indigo-300"
            }`
          }
        >
          Accueil
        </NavLink>

        {/* Separator */}
        <div className="my-1 mx-6 border-t border-gray-700" />

        {/* Portfolio Dropdown */}
        <button
          className="w-full text-left px-6 py-3 font-medium uppercase tracking-wide flex justify-between items-center hover:text-indigo-300"
          onClick={() => setPortfolioOpen(!portfolioOpen)}
        >
          Portfolio
          {portfolioOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
        {portfolioOpen && !isLoadingAlbums && albums.length > 0 && (
          <div className="ml-6 pl-3 border-l border-gray-700 mb-4">
            {albums.map((album) => (
              <NavLink
                key={album._id}
                to={`/album/${album._id}`}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `block py-2 text-sm ${isActive
                    ? "text-indigo-400 font-semibold"
                    : "text-gray-400 hover:text-indigo-300"
                  }`
                }
              >
                {album.name}
              </NavLink>
            ))}
          </div>
        )}


        {/* Blog Dropdown */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        <button
          className="w-full text-left px-6 py-3 font-medium uppercase tracking-wide flex justify-between items-center hover:text-indigo-300"
          onClick={() => setBlogOpen(!blogOpen)}
        >
          Blog
          {blogOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
        {blogOpen && !isLoadingArticles && articles.length > 0 && (
          <div className="ml-6 pl-3 border-l border-gray-700 mb-4">
            {articles.map((art) => (
              <NavLink
                key={art.slug}
                to={`/articles/${art.slug}`}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `block py-2 text-sm ${isActive
                    ? "text-indigo-400 font-semibold"
                    : "text-gray-400 hover:text-indigo-300"
                  }`
                }
              >
                {art.title}
              </NavLink>
            ))}
          </div>
        )}

        {/* À Propos */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        <NavLink
          to="/about"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `block px-6 py-3 font-medium uppercase tracking-wide ${isActive ? "text-indigo-400" : "hover:text-indigo-300"
            }`
          }
        >
          À Propos
        </NavLink>

        {/* Contact */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        <NavLink
          to="/contact"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `block px-6 py-3 font-medium uppercase tracking-wide ${isActive ? "text-indigo-400" : "hover:text-indigo-300"
            }`
          }
        >
          Me contacter
        </NavLink>

        {/* Admin / Connexion / Déconnexion */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        {isAuthenticated ? (
          <>
            <NavLink
              to="/admin"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `block px-6 py-3 font-medium uppercase tracking-wide ${isActive ? "text-indigo-400" : "hover:text-indigo-300"
                }`
              }
            >
              Admin
            </NavLink>
            <button
              onClick={() => {
                logout();
                handleNavigation();
              }}
              className="block w-full text-left px-6 py-3 font-medium uppercase tracking-wide hover:text-indigo-300"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `block px-6 py-3 font-medium uppercase tracking-wide ${isActive ? "text-indigo-400" : "hover:text-indigo-300"
              }`
            }
          >
            Connexion
          </NavLink>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        © 2025 Dany Khadhar<br />
        Tous droits réservés.
      </div>
    </div>
  );
};

export default Sidebar;