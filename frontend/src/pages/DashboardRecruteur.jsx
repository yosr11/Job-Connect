import React, { useState, useEffect } from "react";
import { 
  Briefcase, Users, Calendar, Award, Clock, MapPin, ChevronRight 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DashboardRecruteur = () => {
  const [entrepriseData, setEntrepriseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur parsing user:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEntrepriseData = async () => {
      try {
        const recruteurId = localStorage.getItem("recruteurId");
        if (!recruteurId) throw new Error("Aucun ID recruteur trouvé dans le localStorage");

        const response = await fetch(`http://localhost:5000/api/recruteur/entreprise/${recruteurId}`);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        


        const data = await response.json();
        console.log("Logo reçu :", data.entreprise.logo); // ✅ ici
        setEntrepriseData(data.entreprise);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntrepriseData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!entrepriseData) return <p>Aucune donnée d'entreprise trouvée</p>;

  const entreprise = entrepriseData || {
    nom: "Entreprise",
    logo: "",
    secteur: "Secteur",
    adresse: "Ville, Pays"
  };

  const stats = [
    { label: "Offres actives", value: "12", change: "+3", icon: Briefcase },
    { label: "Nouveaux CV", value: "156", change: "+28", icon: Users },
    { label: "Entretiens", value: "23", change: "+5", icon: Calendar },
    { label: "Embauchés", value: "8", change: "+2", icon: Award }
  ];

  const recentCandidatures = [
    { nom: "Ahmed Ben Ali", poste: "Développeur Full Stack", date: "Il y a 2h", status: "Nouveau", avatar: "AB", match: "95%" },
    { nom: "Sara Trabelsi", poste: "Designer UX/UI", date: "Il y a 5h", status: "En révision", avatar: "ST", match: "88%" },
    { nom: "Mohamed Bouazizi", poste: "Data Analyst", date: "Hier", status: "Nouveau", avatar: "MB", match: "92%" },
    { nom: "Leila Mansour", poste: "Chef de Projet", date: "Hier", status: "Entretien", avatar: "LM", match: "85%" }
  ];

  const offresPopulaires = [
    { titre: "Développeur Full Stack", candidatures: 45, vues: 234, urgent: true },
    { titre: "Designer UX/UI", candidatures: 32, vues: 189, urgent: false },
    { titre: "Data Scientist", candidatures: 28, vues: 156, urgent: true }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 p-8">
      
      {/* Bannière bienvenue */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-3xl p-8 text-white overflow-hidden shadow-2xl mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} />
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Bienvenue dans {entreprise.nom} 🚀</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Trouvez les meilleurs talents et développez votre équipe avec notre plateforme de recrutement intelligente.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-400 p-4 rounded-xl shadow-lg group-hover:scale-110 transition">
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-blue-600 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Candidatures récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Candidatures récentes</h2>
              <p className="text-sm text-gray-500 mt-1">Gérez vos nouveaux talents</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCandidatures.map((candidature, index) => (
              <div key={index} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition">
                      {candidature.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{candidature.nom}</h3>
                      <p className="text-sm text-gray-500 mb-1">{candidature.poste}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {candidature.date}
                        </span>
                        <span className="text-blue-600 font-semibold">Match: {candidature.match}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    candidature.status === 'Nouveau' ? 'bg-blue-100 text-blue-700' :
                    candidature.status === 'En révision' ? 'bg-slate-100 text-slate-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {candidature.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offres populaires */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Offres populaires</h2>
          <div className="space-y-4">
            {offresPopulaires.map((offre, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl hover:shadow-md transition border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{offre.titre}</h3>
                  <div className="text-sm text-gray-600 flex gap-4 mt-1">
                    <span>{offre.candidatures} CV</span>
                    <span>{offre.vues} vues</span>
                  </div>
                </div>
                {offre.urgent && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">Urgent</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecruteur;
