// src/components/layout/Sidebar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AlbumContext } from "../../context/AlbumContext"; // << Import du AlbumContext
import {
  FaHome,
  FaUserShield,
  FaSignInAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaFolderOpen,   // Icône d'album
} from "react-icons/fa";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const { albums, loading } = useContext(AlbumContext); // Récupérer albums du contexte

  const sidebarWidthClass = isCollapsed ? "w-16" : "w-64";

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen
        bg-black text-gray-200
        flex flex-col
        transition-all duration-300
        ${sidebarWidthClass}
        font-poppins
      `}
    >
      {/* Bouton toggle */}
      <div className="flex justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="text-gray-200 hover:text-white focus:outline-none"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Ton nom/prénom dans le titre */}
      <div className="mb-8 px-4 flex flex-col items-center">
        {!isCollapsed && (
          <div className="text-center text-4xl font-signature italic text-gray-100 tracking-wider">
            Dany Khadhar
          </div>
        )}
      </div>

      {/* Menu principal */}
      <nav className="flex-1 overflow-y-auto">
        {/* Lien Accueil */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 transition-colors 
            ${isActive ? "bg-gray-500" : "hover:bg-gray-700"}`
          }
        >
          <FaHome className="text-xl" />
          {!isCollapsed && <span className="ml-2 text-sm">Accueil</span>}
        </NavLink>

        {/* Lien Admin (si connecté) */}
        {isAuthenticated && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 transition-colors
              ${isActive ? "bg-gray-500" : "hover:bg-gray-800"}`
            }
          >
            <FaUserShield className="text-xl" />
            {!isCollapsed && <span className="ml-2 text-sm">Admin</span>}
          </NavLink>
        )}

        {/* Section Albums */}
        {!loading && albums.length > 0 && (
          <div className="mt-4">
            {!isCollapsed && (
              <h3 className="px-4 py-2 text-gray-400 uppercase text-xs">
                Albums
              </h3>
            )}
            {albums.map((album) => (
              <NavLink
                key={album._id}
                to={`/album/${album._id}`}
                className={({ isActive }) =>
                  `flex items-center px-6 py-2 transition-colors
                  ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }
              >
                <FaFolderOpen className="text-lg" />
                {!isCollapsed && (
                  <span className="ml-2 text-sm">{album.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Auth : si non connecté => Connexion */}
        {!isAuthenticated && (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 transition-colors
              ${isActive ? "bg-gray-500" : "hover:bg-gray-800"}`
            }
          >
            <FaSignInAlt className="text-xl" />
            {!isCollapsed && <span className="ml-2 text-sm">Connexion</span>}
          </NavLink>
        )}

        {/* Auth : si connecté => Déconnexion */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-800 transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            {!isCollapsed && <span className="ml-2 text-sm">Déconnexion</span>}
          </button>
        )}

        {/* Lien "À propos" */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 transition-colors 
            ${isActive ? "bg-gray-500" : "hover:bg-gray-700"}`
          }
        >
          <FaInfoCircle className="text-xl" />
          {!isCollapsed && <span className="ml-2 text-sm">À Propos</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500">
        {!isCollapsed && (
          <>
            © 2025 Dany Khadhar
            <br />
            All rights reserved.
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
