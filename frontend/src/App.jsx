// src/App.jsx
import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import AppRoutes from "./routes/AppRoutes"; 

function App() {
  // isCollapsed = false => sidebar large (w-64)
  // isCollapsed = true  => sidebar étroite (w-16)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Classe de marge dynamique pour le contenu principal
  const mainMarginClass = isCollapsed ? "ml-16" : "ml-64";

  return (
    <div className="font-poppins bg-gray-100 min-h-screen">
      {/* Sidebar en position fixe */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Conteneur principal décalé à droite */}
      <div
        className={`
          bg-gray-900 text-white
          transition-all duration-300
          ${mainMarginClass}
          min-h-screen
          p-4
        `}
      >
        {/* Exemple : header, puis les routes/pages */}
        <header className="mb-4">
        </header>
        <main>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
