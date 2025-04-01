import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlbums } from "../../hooks/useAlbums";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = ({ closeSidebar }) => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const { albums, isLoading } = useAlbums();
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  const handleNavigation = () => {
    if (window.innerWidth < 768) closeSidebar();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-black text-gray-200 flex flex-col shadow-lg z-50">
      
      {/* === Logo === */}
      <div className="mt-8 mb-6 px-6 text-center">
        <div className="text-white font-signature text-5xl leading-snug">
          Dany<br />Khadhar
        </div>
      </div>

      {/* === Navigation === */}
      <nav className="flex-1 overflow-y-auto scrollbar-none text-sm">

        {/* Accueil */}
        <NavLink
          to="/"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `block px-6 py-3 font-medium tracking-wide uppercase ${
              isActive ? "text-indigo-400" : "hover:text-indigo-300"
            }`
          }
        >
          Accueil
        </NavLink>

        {/* Barre */}
        <div className="my-1 mx-6 border-t border-gray-700" />

        {/* Portfolio Dropdown */}
        <button
          className="w-full text-left px-6 py-3 font-medium uppercase tracking-wide flex justify-between items-center hover:text-indigo-300"
          onClick={() => setPortfolioOpen(!portfolioOpen)}
        >
          Portfolio
          {portfolioOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>

        {portfolioOpen && !isLoading && albums.length > 0 && (
          <div className="ml-6 pl-3 border-l border-gray-700 mb-4">
            {albums.map((album) => (
              <NavLink
                key={album._id}
                to={`/album/${album._id}`}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `block py-2 text-sm ${
                    isActive
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

        {/* À Propos */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        <NavLink
          to="/about"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `block px-6 py-3 font-medium uppercase tracking-wide ${
              isActive ? "text-indigo-400" : "hover:text-indigo-300"
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
            `block px-6 py-3 font-medium uppercase tracking-wide ${
              isActive ? "text-indigo-400" : "hover:text-indigo-300"
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
                `block px-6 py-3 font-medium uppercase tracking-wide ${
                  isActive ? "text-indigo-400" : "hover:text-indigo-300"
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
              `block px-6 py-3 font-medium uppercase tracking-wide ${
                isActive ? "text-indigo-400" : "hover:text-indigo-300"
              }`
            }
          >
            Connexion
          </NavLink>
        )}

        {/* Blog */}
        <div className="my-1 mx-6 border-t border-gray-700" />
        <div className="px-6 py-3 text-gray-500 uppercase text-xs tracking-widest">
          Blog (bientôt)
        </div>
      </nav>

      {/* === Footer === */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
        © 2025 Dany Khadhar<br />
        Tous droits réservés.
      </div>
    </div>
  );
};

export default Sidebar;
