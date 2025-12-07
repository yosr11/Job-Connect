// src/pages/AllOffresCandidat.jsx - VERSION COMPLETE UPDATED
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⭐ AJOUTE HEDHA
import { Briefcase, Eye, Calendar, Clock, Building2, Award, Send } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const AllOffresCandidat = () => {
  const navigate = useNavigate(); // ⭐ AJOUTE HEDHA
  
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOffres = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Token manquant, veuillez vous connecter.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/offres`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      setOffres(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  // ⭐ BADDEL EL FONCTION HEDHI - Navigation simple
  const handlePostuler = (offreId) => {
    navigate(`/candidat/postuler/${offreId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateDaysLeft = (dateLimite) => {
    const now = new Date();
    const limite = new Date(dateLimite);
    const diffTime = limite - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 3) return 'text-red-600 bg-red-50 border-red-200';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
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

  useEffect(() => {
    fetchOffres();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des offres...</p>
        </div>
      </div>
    );

  if (message)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-lg">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Offres d'emploi</h1>
          <p className="text-gray-600">{offres.length} offre{offres.length > 1 ? 's' : ''} disponible{offres.length > 1 ? 's' : ''}</p>
        </div>

        {offres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">Aucune offre disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {offres.map((offre) => {
              const daysLeft = calculateDaysLeft(offre.date_limite);
              const urgencyColor = getUrgencyColor(daysLeft);
              const niveauColor = getNiveauColor(offre.niveau);

              return (
                <div
                  key={offre._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                >
                  {/* Header avec entreprise */}
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      {/* Logo placeholder */}
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <Building2 className="text-white" size={28} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                          {offre.nom_entreprise}
                        </h3>
                        <h2 className="text-gray-700 font-semibold text-base leading-tight">
                          {offre.titre}
                        </h2>
                        
                        {/* Badge niveau */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${niveauColor}`}>
                            <Award size={12} />
                            {offre.niveau}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-6 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {offre.description}
                    </p>
                  </div>

                  {/* Infos dates */}
                  <div className="px-6 pb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Début : <span className="font-medium">{formatDate(offre.date_debut)}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-600">Date limite : <span className="font-medium">{formatDate(offre.date_limite)}</span></span>
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold border ${urgencyColor}`}>
                        {daysLeft > 0 ? `${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}` : 'Expiré'}
                      </span>
                    </div>
                  </div>

                  {/* Footer avec stats et actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Eye size={16} className="text-gray-400" />
                          <span className="font-medium">{offre.vues || 0}</span> vues
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={16} className="text-gray-400" />
                          <span className="font-medium">{offre.candidatures?.length || 0}</span> candidatures
                        </span>
                      </div>

                      {/* ⭐ BOUTON POSTULER - UPDATED */}
                      <button
                        onClick={() => handlePostuler(offre._id)}
                        disabled={daysLeft <= 0}
                        className={`
                          flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm
                          transition-all duration-200 shadow-sm
                          ${daysLeft <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                          }
                        `}
                      >
                        {daysLeft <= 0 ? (
                          'Expiré'
                        ) : (
                          <>
                            <Send size={16} />
                            Postuler
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOffresCandidat;