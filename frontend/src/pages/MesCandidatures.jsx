import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, Building2, FileText, Trash2, AlertCircle, CheckCircle, Clock, XCircle, Users, Search, Bell, LogOut, Menu, X, MapPin, Home, FileSearch, Send, User as UserIcon } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const MesCandidatures = () => {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [candidat, setCandidat] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Récupérer les infos du candidat
    const storedCandidat = JSON.parse(localStorage.getItem("user") || "{}");
    setCandidat(storedCandidat);
    
    fetchMesCandidatures();
  }, []);

  const fetchMesCandidatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const candidatId = localStorage.getItem('candidatId');

      console.log("🔑 Token:", token);
      console.log("👤 Candidat ID:", candidatId);
      console.log("🌐 URL appelée:", `${API_URL}/candidatures/candidat/${candidatId}`);

      if (!candidatId) {
        setError("ID candidat introuvable. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/candidatures/candidat/${candidatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("📦 Données reçues:", data);

      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération");

      setCandidatures(data.candidatures);
      setLoading(false);
    } catch (error) {
      console.error("❌ Erreur:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDelete = async (candidatureId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer cette candidature ?")) return;

    setDeleteLoading(candidatureId);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/candidatures/${candidatureId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur lors de la suppression");

      setCandidatures(prev => prev.filter(c => c._id !== candidatureId));
      alert("✅ Candidature retirée avec succès");
    } catch (error) {
      console.error(error);
      alert("❌ " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getEtatStyle = (etat) => {
    const styles = {
      'en attente': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: Clock,
      },
      'accepte': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle,
      },
      'refuse': {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
      },
      'entretien': {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Users,
      },
    };
    return styles[etat] || styles['en attente'];
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      'Junior': 'bg-blue-100 text-blue-700 border-blue-200',
      'Intermédiaire': 'bg-purple-100 text-purple-700 border-purple-200',
      'Senior': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Expert': 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[niveau] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const navigationItems = [
    { id: "accueil", label: "Tableau de bord", route: "/dashboard-candidat", icon: Home },
    { id: "offres", label: "Offres d'emploi", route: "/AllOffresCandidat", icon: FileSearch },
    { id: "candidatures", label: "Mes candidatures", route: "/candidat/mes-candidatures", icon: Send },
    { id: "profil", label: "Profil", route: "/ProfilCandidat", icon: UserIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-lg flex items-center gap-3">
          <AlertCircle size={24} />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* 🔥 SIDEBAR */}
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
                    <MapPin size={10} /> {candidat.adresse || "Tunisie"}
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
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.route;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 🔥 NAVBAR */}
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
            {/* Notifications */}
            <button className="relative p-3 hover:bg-gray-50 rounded-xl transition">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition flex items-center gap-2 font-medium"
              title="Se déconnecter"
            >
              <LogOut size={20} />
              Se déconnecter
            </button>
          </div>
        </header>

        {/* CONTENU SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Candidatures</h1>
              <p className="text-gray-600">
                Vous avez postulé à <span className="font-semibold text-blue-600">{candidatures.length}</span> offre{candidatures.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Liste des candidatures */}
            {candidatures.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune candidature</h3>
                <p className="text-gray-600 mb-6">Vous n'avez pas encore postulé à des offres d'emploi.</p>
                <button
                  onClick={() => navigate('/AllOffresCandidat')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  Découvrir les offres
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {candidatures.map((candidature) => {
                  const etatStyle = getEtatStyle(candidature.etat);
                  const EtatIcon = etatStyle.icon;

                  return (
                    <div
                      key={candidature._id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          {/* Info principale */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                              <Briefcase className="text-white" size={28} />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {candidature.id_offre?.titre || "Offre supprimée"}
                              </h3>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <Building2 className="text-gray-400" size={16} />
                                <span className="text-gray-600 font-medium">
                                  {candidature.id_offre?.nom_entreprise || "N/A"}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 flex-wrap mb-3">
                                {/* Statut */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${etatStyle.bg} ${etatStyle.text} ${etatStyle.border}`}>
                                  <EtatIcon size={14} />
                                  {candidature.etat.charAt(0).toUpperCase() + candidature.etat.slice(1)}
                                </span>

                                {/* Niveau */}
                                {candidature.id_offre?.niveau && (
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getNiveauColor(candidature.id_offre.niveau)}`}>
                                    {candidature.id_offre.niveau}
                                  </span>
                                )}

                                {/* Date de postulation */}
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Calendar size={14} />
                                  Postulé le {formatDate(candidature.date_postulation)}
                                </span>
                              </div>

                              {/* Description */}
                              {candidature.id_offre?.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {candidature.id_offre.description}
                                </p>
                              )}

                              {/* Lettre de motivation */}
                              {candidature.lettre_motivation_fichier && (
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                  <FileText className="text-blue-600" size={16} />
                                  <a
                                    href={`${API_URL.replace('/api', '')}/${candidature.lettre_motivation_fichier}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                  >
                                    Voir ma lettre de motivation
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bouton supprimer */}
                          <button
                            onClick={() => handleDelete(candidature._id)}
                            disabled={deleteLoading === candidature._id}
                            className="p-3 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50"
                            title="Retirer ma candidature"
                          >
                            {deleteLoading === candidature._id ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="text-gray-400 group-hover:text-red-600" size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Score */}
                      {candidature.score > 0 && (
                        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Score de compatibilité</span>
                            <span className="text-lg font-bold text-blue-600">{candidature.score}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MesCandidatures;