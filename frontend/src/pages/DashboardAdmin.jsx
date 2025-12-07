import React, { useEffect, useState } from "react";
import { Users, Building2, Briefcase, UserCheck, LogOut, BarChart3, FileText } from "lucide-react";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("candidats");
  const [candidats, setCandidats] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async (endpoint, setState) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setState(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setState([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("candidats", setCandidats),
        fetchData("recruteurs", setRecruteurs),
        fetchData("entreprises", setEntreprises),
        fetchData("offres", setOffres),
        fetchData("candidatures", setCandidatures),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const tabs = [
    { id: "candidats", label: "Candidats", icon: Users, count: candidats.length, gradient: "from-cyan-400 to-blue-500", iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
    { id: "recruteurs", label: "Recruteurs", icon: UserCheck, count: recruteurs.length, gradient: "from-emerald-400 to-teal-500", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { id: "entreprises", label: "Entreprises", icon: Building2, count: entreprises.length, gradient: "from-violet-400 to-purple-500", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
    { id: "offres", label: "Offres d'emploi", icon: Briefcase, count: offres.length, gradient: "from-amber-400 to-orange-500", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { id: "candidatures", label: "Candidatures", icon: FileText, count: candidatures.length, gradient: "from-rose-400 to-pink-500", iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  ];

  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Chargement des données...</p>
        </div>
      );
    }

    const activeTabData = tabs.find(t => t.id === activeTab);

    switch (activeTab) {
      case "candidats":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-b-2 border-cyan-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-800 uppercase tracking-wider">Nom complet</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-800 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-800 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-cyan-800 uppercase tracking-wider">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-12 h-12 text-cyan-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Aucun candidat</p>
                        <p className="text-gray-500 mt-1">Les candidats inscrits apparaîtront ici</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidats.map((c, idx) => (
                    <tr key={c._id} className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                            {c.nom?.charAt(0)}{c.prenom?.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{c.nom} {c.prenom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.email}</td>
                      <td className="px-6 py-4 text-gray-600">{c.num_tel || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "recruteurs":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-b-2 border-emerald-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recruteurs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                          <UserCheck className="w-12 h-12 text-emerald-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Aucun recruteur</p>
                        <p className="text-gray-500 mt-1">Les recruteurs inscrits apparaîtront ici</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recruteurs.map((r, idx) => (
                    <tr key={r._id} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold mr-3">
                            {r.nom?.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{r.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{r.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                          {r.entreprise?.nom || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{r.num_tel || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "entreprises":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border-b-2 border-violet-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">Secteur</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">Localisation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-violet-800 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entreprises.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                          <Building2 className="w-12 h-12 text-violet-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Aucune entreprise</p>
                        <p className="text-gray-500 mt-1">Les entreprises enregistrées apparaîtront ici</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entreprises.map((e, idx) => (
                    <tr key={e._id} className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                            {e.nom?.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{e.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                          {e.secteur}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{e.adresse}</td>
                      <td className="px-6 py-4 text-gray-600">{e.num_tel || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "offres":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b-2 border-amber-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Poste</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">Date limite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {offres.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                          <Briefcase className="w-12 h-12 text-amber-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Aucune offre</p>
                        <p className="text-gray-500 mt-1">Les offres d'emploi apparaîtront ici</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  offres.map((o, idx) => (
                    <tr key={o._id} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mr-3">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-gray-900">{o.titre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{o.entrepriseId?.nom || o.nom_entreprise || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                          {o.niveau}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{o.type_contrat || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {o.date_limite ? new Date(o.date_limite).toLocaleDateString('fr-FR') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "candidatures":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border-b-2 border-rose-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-rose-800 uppercase tracking-wider">Candidat</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-rose-800 uppercase tracking-wider">Offre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-rose-800 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-rose-800 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidatures.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-12 h-12 text-rose-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">Aucune candidature</p>
                        <p className="text-gray-500 mt-1">Les candidatures soumises apparaîtront ici</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidatures.map((c, idx) => (
                    <tr key={c._id} className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                            {c.id_candidat?.nom?.charAt(0) || '?'}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {c.id_candidat?.nom || 'N/A'} {c.id_candidat?.prenom || ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{c.id_offre?.titre || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{c.id_offre?.entrepriseId?.nom || '-'}</td>
                      
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          c.etat === 'accepted' || c.etat === 'accepté' 
                            ? 'bg-green-100 text-green-700' 
                            : c.etat === 'rejected' || c.etat === 'rejeté'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.etat || 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header moderne avec dégradé */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-indigo-100 text-lg">Gérez votre plateforme de recrutement</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-all duration-200 border border-white/30 hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cartes statistiques avec vrais dégradés colorés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isActive ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${tab.iconBg} p-3 rounded-xl`}>
                      <Icon className={`w-7 h-7 ${tab.iconColor}`} />
                    </div>
                    {isActive && (
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full">
                        ACTIF
                      </span>
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">{tab.label}</h3>
                  <p className="text-4xl font-black text-gray-900">{tab.count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tableau avec design moderne */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {tabs.find(t => t.id === activeTab) && (
                <>
                  {React.createElement(tabs.find(t => t.id === activeTab).icon, { 
                    className: `w-7 h-7 ${tabs.find(t => t.id === activeTab).iconColor}` 
                  })}
                  <h2 className="text-2xl font-bold text-gray-800">
                    Liste des {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                </>
              )}
            </div>
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;