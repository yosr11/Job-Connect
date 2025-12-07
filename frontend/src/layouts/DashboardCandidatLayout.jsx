// src/layouts/DashboardCandidatLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Search, Bell, User, X, Menu, MapPin } from "lucide-react";

const DashboardCandidatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [candidat, setCandidat] = useState({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Récupérer les infos du candidat depuis le localStorage
  useEffect(() => {
    const storedCandidat = JSON.parse(localStorage.getItem("user") || "{}");
    setCandidat(storedCandidat);
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fermer le menu profil si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { id: "accueil", label: "Tableau de bord", route: "/dashboard-candidat" },
    { id: "offres", label: "Offres d'emploi", route: "/AllOffresCandidat" },
    { id: "candidatures", label: "Mes candidatures", route: "/candidat/mes-candidatures" },
    { id: "profil", label: "Profil", route: "/ProfilCandidat" },
    
    
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white/80 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col border-r border-white/20`}
      >
        <div className="p-6 border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {candidat.nom?.[0] || "C"}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{candidat.nom || "Candidat"}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {candidat.ville || "Ville"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex justify-center p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                location.pathname === item.route
                  ? "bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/20 px-8 py-4 flex justify-between items-center">
          <div className="relative group w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 hover:bg-gray-50 rounded-xl">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
            <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 border-t border-gray-100"
                  >
                    🔓 Se déconnecter
                  </button>
          </div>

            
          
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardCandidatLayout;
