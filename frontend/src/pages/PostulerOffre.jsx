// 📁 src/pages/PostulerOffre.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, TrendingUp, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const PostulerOffre = () => {
  const { offreId } = useParams();
  const navigate = useNavigate();

  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // Données ML
  const [scoreMatch, setScoreMatch] = useState(null);
  const [bestSentence, setBestSentence] = useState("");
  const [commonKeywords, setCommonKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [errorScore, setErrorScore] = useState("");

  // ⚡ Récupérer l'offre
  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/offres/${offreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Offre introuvable");

        const data = await response.json();
        setOffre(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffre();
  }, [offreId]);

  // 🔥 Calculer le score automatiquement
  useEffect(() => {
    if (offre) {
      calculerScore();
    }
  }, [offre]);

  // ⚡ Fonction de calcul du score
  const calculerScore = async () => {
    setLoadingScore(true);
    setErrorScore("");
    
    try {
      const token = localStorage.getItem("token");
      const candidatId = localStorage.getItem("candidatId");

      if (!candidatId) {
        throw new Error("ID candidat introuvable. Veuillez vous reconnecter.");
      }

      console.log("🔍 Calcul du score...");

      const response = await fetch(
        `${API_URL}/candidatures/calculate-score/${offreId}/${candidatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur calcul du score");
      }

      const data = await response.json();

      setScoreMatch(data.score || 0);
      setBestSentence(data.best_sentence || "");
      setCommonKeywords(data.common_keywords || []);
      setMissingKeywords(data.missing_keywords || []);

      console.log("✅ Score calculé:", data);
    } catch (err) {
      console.error("❌ Erreur calcul score:", err.message);
      setErrorScore(err.message);
      setScoreMatch(null);
    } finally {
      setLoadingScore(false);
    }
  };

  // ⚡ Envoyer la candidature
  const handleSubmit = async () => {
    if (scoreMatch === null) {
      alert("⚠️ Veuillez attendre le calcul du score");
      return;
    }

    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem("token");
      const candidatId = localStorage.getItem("candidatId");

      if (!candidatId) {
        throw new Error("ID candidat introuvable. Veuillez vous reconnecter.");
      }

      const response = await fetch(`${API_URL}/candidatures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_offre: offreId,
          id_candidat: candidatId,
          score: scoreMatch,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la candidature");
      }

      const result = await response.json();

      alert(`🎉 Candidature envoyée avec succès ! Score : ${result.score}%`);
      navigate("/AllOffresCandidat");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ⚡ Helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      Junior: "bg-blue-100 text-blue-700 border-blue-200",
      Intermédiaire: "bg-purple-100 text-purple-700 border-purple-200",
      Senior: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Expert: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return colors[niveau] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent match ! 🎉";
    if (score >= 60) return "Bon match 👍";
    if (score >= 40) return "Match moyen ⚠️";
    return "Faible correspondance 📉";
  };

  // ⚡ Render Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-600 text-xl">Offre introuvable</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
      >
        <ArrowLeft size={20} />
        Retour aux offres
      </button>

      {/* Détails de l'offre */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{offre.titre}</h1>
        <p className="text-gray-600 text-lg mb-4">{offre.nom_entreprise}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getNiveauColor(
              offre.niveau
            )}`}
          >
            {offre.niveau}
          </span>
          <span className="text-sm text-gray-500">
            📅 Début : {formatDate(offre.date_debut)}
          </span>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{offre.description}</p>
        </div>
      </div>

      {/* Score de compatibilité */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">
              Analyse de compatibilité
            </h2>
          </div>
          
          {!loadingScore && (
            <button
              onClick={calculerScore}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Recalculer le score"
            >
              <RefreshCw size={20} />
            </button>
          )}
        </div>

        {loadingScore ? (
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-700 font-medium text-lg">
                🔄 Analyse de votre CV en cours...
              </p>
            </div>
          </div>
        ) : errorScore ? (
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <p className="text-red-700 font-semibold mb-2">Erreur lors du calcul du score</p>
                <p className="text-red-600 text-sm mb-3">{errorScore}</p>
                <button
                  onClick={calculerScore}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        ) : scoreMatch !== null ? (
          <div className="space-y-4">
            {/* Score principal */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-semibold text-gray-900">
                  {getScoreMessage(scoreMatch)}
                </p>
                <span className="text-4xl font-bold text-blue-600">
                  {scoreMatch.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                <div
                  className={`h-5 rounded-full transition-all duration-1000 ${getScoreColor(
                    scoreMatch
                  )}`}
                  style={{ width: `${scoreMatch}%` }}
                />
              </div>
            </div>

            {/* Meilleure phrase */}
            {bestSentence && (
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      📌 Meilleure correspondance trouvée dans votre CV
                    </p>
                    <p className="text-sm text-gray-600 italic">"{bestSentence}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Compétences trouvées */}
            {commonKeywords.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Compétences correspondantes ({commonKeywords.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonKeywords.slice(0, 15).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300"
                    >
                      {keyword}
                    </span>
                  ))}
                  {commonKeywords.length > 15 && (
                    <span className="px-3 py-1 text-green-700 text-xs font-medium">
                      +{commonKeywords.length - 15} autres
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Compétences manquantes */}
            {missingKeywords.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Compétences recherchées non détectées ({missingKeywords.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.slice(0, 15).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-300"
                    >
                      {keyword}
                    </span>
                  ))}
                  {missingKeywords.length > 15 && (
                    <span className="px-3 py-1 text-yellow-700 text-xs font-medium">
                      +{missingKeywords.length - 15} autres
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bouton de candidature */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          onClick={handleSubmit}
          disabled={loadingSubmit || loadingScore || scoreMatch === null}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          {loadingSubmit ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={24} />
              Postuler à cette offre
            </>
          )}
        </button>

        {scoreMatch !== null && !loadingSubmit && (
          <p className="text-center text-sm text-gray-600 mt-3">
            Votre score de <strong>{scoreMatch.toFixed(1)}%</strong> sera enregistré avec votre candidature
          </p>
        )}

        {(loadingScore || scoreMatch === null) && !errorScore && (
          <p className="text-center text-sm text-gray-500 mt-3">
            ⏳ Veuillez attendre le calcul du score de compatibilité
          </p>
        )}
      </div>
    </div>
  );
};

export default PostulerOffre;