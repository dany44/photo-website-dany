// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlbums } from "../../hooks/useAlbums";
import {
  FaHome,
  FaUserShield,
  FaSignInAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaFolderOpen,
} from "react-icons/fa";

const Sidebar = ({ closeSidebar }) => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const { albums, isLoading } = useAlbums();

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-black text-gray-200 flex flex-col transition-all duration-300 font-poppins">
      <div className="mt-8 mb-8 px-4 flex flex-col items-center">
        <div className="text-center text-5xl font-signature italic text-gray-100 tracking-wide">
          Dany Khadhar
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <NavLink
          to="/"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 transition-colors ${
              isActive ? "bg-gray-500" : "hover:bg-gray-700"
            }`
          }
        >
          <FaHome className="text-xl" />
          <span className="ml-2 text-sm">Accueil</span>
        </NavLink>

        {/* Section Blog (placeholder, pas de nav pour le moment) */}
        <div className="mt-4 px-4 py-2 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Blog</h3>
          <p className="text-xs text-gray-400 mt-1">
            Bientôt disponible...
          </p>
        </div>

        {isAuthenticated && (
          <NavLink
            to="/admin"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 transition-colors ${
                isActive ? "bg-gray-500" : "hover:bg-gray-800"
              }`
            }
          >
            <FaUserShield className="text-xl" />
            <span className="ml-2 text-sm">Admin</span>
          </NavLink>
        )}

        {!isLoading && albums.length > 0 && (
          <div className="mt-4">
            <h3 className="px-4 py-2 text-gray-400 uppercase text-xs">
              Portfolio
            </h3>
            {albums.map((album) => (
              <NavLink
                key={album._id}
                to={`/album/${album._id}`}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex items-center px-6 py-2 transition-colors ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                <FaFolderOpen className="text-lg" />
                <span className="ml-2 text-sm">{album.name}</span>
              </NavLink>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <NavLink
            to="/login"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 transition-colors ${
                isActive ? "bg-gray-500" : "hover:bg-gray-800"
              }`
            }
          >
            <FaSignInAlt className="text-xl" />
            <span className="ml-2 text-sm">Connexion</span>
          </NavLink>
        )}

        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              handleNavigation();
            }}
            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-800 transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="ml-2 text-sm">Déconnexion</span>
          </button>
        )}

        <NavLink
          to="/about"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 transition-colors ${
              isActive ? "bg-gray-500" : "hover:bg-gray-700"
            }`
          }
        >
          <FaInfoCircle className="text-xl" />
          <span className="ml-2 text-sm">À Propos</span>
        </NavLink>
      </nav>

      <div className="p-4 text-center text-xs text-gray-500">
        © 2025 Dany Khadhar
        <br />
        All rights reserved.
      </div>
    </div>
  );
};

export default Sidebar;
