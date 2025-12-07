import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Trash2, AlertCircle, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const MesCandidaturesRecruteur = () => {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [userRole, setUserRole] = useState("recruteur");

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/candidatures/recruteur/offres`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la récupération");
      setCandidatures(data.candidatures);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (candidatureId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) return;

    setDeleteLoading(candidatureId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/candidatures/${candidatureId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la suppression");
      setCandidatures(prev => prev.filter(c => c._id !== candidatureId));
      alert("✅ Candidature supprimée avec succès");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getEtatStyle = (etat) => {
    const styles = {
      'en attente': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock },
      'accepte': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle },
      'refuse': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
      'entretien': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: Users },
    };
    return styles[etat] || styles['en attente'];
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Chargement des candidatures...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <AlertCircle size={24} />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Candidatures reçues</h1>
      {candidatures.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold">Aucune candidature</h3>
          <p>Vos offres n'ont reçu aucune candidature pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidatures.map((c) => {
            const etatStyle = getEtatStyle(c.etat);
            const EtatIcon = etatStyle.icon;
            return (
              <div key={c._id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center border">
                <div>
                  <h3 className="font-bold text-lg">{c.id_candidat?.nom || "Candidat supprimé"}</h3>
                  <p className="text-gray-600">{c.id_offre?.titre || "Offre supprimée"}</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${etatStyle.bg} ${etatStyle.text} ${etatStyle.border}`}>
                    <EtatIcon size={14} /> {c.etat.charAt(0).toUpperCase() + c.etat.slice(1)}
                  </span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="text-lg font-bold text-blue-600">{c.score}%</span>

                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deleteLoading === c._id}
                    className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg disabled:opacity-50"
                  >
                    {deleteLoading === c._id ? "..." : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MesCandidaturesRecruteur;
