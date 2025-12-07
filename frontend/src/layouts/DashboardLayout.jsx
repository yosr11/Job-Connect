// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { 
  Search, Bell, User, Briefcase, Users, BarChart3, Settings, Menu, X, Target, MapPin 
} from "lucide-react";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entreprise, setEntreprise] = useState({});
  const [user, setUser] = useState({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    const fetchEntreprise = async () => {
      const recruteurId = localStorage.getItem("recruteurId");
      if (!recruteurId) return;
      const res = await fetch(`http://localhost:5000/api/recruteur/entreprise/${recruteurId}`);
      const data = await res.json();
      setEntreprise(data.entreprise);
    };
    fetchEntreprise();
  }, []);

  // 🔒 Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 Ferme le menu si clic à l'extérieur
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
    { id: "accueil", label: "Tableau de bord", icon: BarChart3, route: "/dashboard-recruteur" },
    { id: "offres", label: "Offres d'emploi", icon: Briefcase, route: "/offres" },
    { id: "candidatures", label: "Candidatures", icon: Users, route: "/recruteur/mes-candidatures" },
    { id: "entreprise", label: "Mon Entreprise", icon: Target, route: "/entreprise" },
    { id: "parametres", label: "Paramètres", icon: Settings, route: "/parametres" }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} bg-white/80 backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col border-r border-white/20`}>
        <div className="p-6 border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {entreprise.logo && (
                  <img
                    src={`http://localhost:5000/${entreprise.logo.startsWith('/') ? entreprise.logo.slice(1) : entreprise.logo}`}
                    alt="logo"
                    className="w-12 h-12 rounded-xl shadow-lg"
                  />
                )}
                <div>
                  <h2 className="font-bold text-gray-800">{entreprise.nom}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {entreprise.adresse}
                  </p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="w-full flex justify-center p-2 hover:bg-gray-100 rounded-lg">
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
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/20 px-8 py-4 flex justify-between items-center">
          {/* Barre de recherche */}
          <div className="relative group w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Icônes à droite */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-3 hover:bg-gray-50 rounded-xl">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>

            {/* Profil utilisateur */}
            <div className="relative border-l pl-4" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <p className="text-sm text-gray-800 font-semibold">{user?.role || "Utilisateur"}</p>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-500 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition">
                  <User size={18} />
                </div>
              </button>

              {/* Menu déroulant du profil */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  <button
                    onClick={() => {
                      navigate("/profil");
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                  >
                    <User size={16} /> Mon Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100"
                  >
                    🔓 Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page spécifique affichée ici */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
