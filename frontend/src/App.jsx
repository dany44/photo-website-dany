import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  return (
    <div className="font-poppins bg-gray-100 min-h-screen overflow-hidden">
      {/* Bouton "menu burger" pour les téléphones */}
      <button
        onClick={toggleSidebar}
        className="
          fixed top-4 right-4 z-50
          p-2 bg-gray-800 text-white rounded
          md:hidden
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Sidebar affichée en fonction de isSidebarVisible */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-black text-white transition-transform duration-300 z-50
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      {/* Conteneur principal décalé en fonction de isSidebarVisible */}
      <div
        className={`
          bg-gray-900 text-white
          transition-all duration-300
          min-h-screen
          p-0
          ${isSidebarVisible ? "ml-64" : "ml-0"}
          md:ml-64
        `}
      >
        {/* Exemple : header, puis les routes/pages */}
        <header className="mb-0"></header>
        <main>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
