// src/pages/DashboardCandidat.jsx
import React, { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const DashboardCandidat = () => {
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchCandidat = async () => {
    try {
      const token = localStorage.getItem("token");
      const candidatId = localStorage.getItem("candidatId");

      if (!token || !candidatId) {
        setMessage("Token ou ID du candidat manquant.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/candidat/${candidatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      setCandidat(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidat();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );

  if (message)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle />
          {message}
        </div>
      </div>
    );

  const stats = [
    { label: "Candidatures envoyées", value: candidat.candidatures?.length || 0 },
    { label: "Offres sauvegardées", value: candidat.offres_sauvegardees?.length || 0 },
    { label: "Entretiens planifiés", value: candidat.entretiens?.length || 0 },
  ];

  const recentApplications = candidat.candidatures?.slice(-4).reverse() || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Bannière */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-3xl p-8 text-white mb-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} />
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Bienvenue, {candidat.nom} 🚀</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Voici votre tableau de bord pour suivre vos candidatures et offres sauvegardées.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
            <div className="mb-2 font-bold text-2xl text-gray-800">{stat.value}</div>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Candidatures récentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Candidatures récentes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentApplications.map((candidature, index) => (
            <div key={index} className="p-6 hover:bg-blue-50 transition flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{candidature.poste}</h3>
                <p className="text-sm text-gray-500">{new Date(candidature.date).toLocaleDateString()}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                {candidature.status || "Nouveau"}
              </span>
            </div>
          ))}
          {recentApplications.length === 0 && (
            <div className="p-6 text-gray-500 text-sm">Aucune candidature récente.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidat;
