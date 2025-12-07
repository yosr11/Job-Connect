import React, { useEffect, useState } from "react";
import { Briefcase, Calendar, Building2, GraduationCap, Edit2, Trash2, Lock } from "lucide-react";

const OffreEmploi = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [entrepriseNom, setEntrepriseNom] = useState(""); // ← Nouveau state
  const [loadingEntreprise, setLoadingEntreprise] = useState(true); // ← Nouveau state
  
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    niveau: "",
    nom_entreprise: "", // Sera rempli automatiquement
    date_debut: "",
    date_limite: "",
  });

  const token = localStorage.getItem("token");
  const recruteurId = localStorage.getItem("recruteurId");

  // ⚡ Récupérer les informations de l'entreprise
  useEffect(() => {
    fetchEntrepriseInfo();
    fetchOffres();
  }, []);

  const fetchEntrepriseInfo = async () => {
    try {
      setLoadingEntreprise(true);
      const res = await fetch(`http://localhost:5000/api/recruteur/entreprise/${recruteurId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération de l'entreprise");
      }

      const data = await res.json();
      console.log("✅ Entreprise récupérée:", data);

      const nomEntreprise = data.entreprise?.nom || "";
      setEntrepriseNom(nomEntreprise);
      
      // ⚡ Pré-remplir le formulaire avec le nom de l'entreprise
      setFormData(prev => ({
        ...prev,
        nom_entreprise: nomEntreprise
      }));

    } catch (error) {
      console.error("❌ Erreur récupération entreprise:", error);
      setError("Impossible de récupérer les informations de l'entreprise");
    } finally {
      setLoadingEntreprise(false);
    }
  };

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/offres/mes-offres", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des offres");
      }

      const data = await res.json();
      setOffres(data);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les offres");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // ⚡ Empêcher la modification du nom d'entreprise
    if (name === "nom_entreprise") {
      return; // Ne rien faire
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validation des dates
      if (new Date(formData.date_limite) < new Date(formData.date_debut)) {
        setError("La date limite doit être après la date de début");
        return;
      }

      // ⚡ S'assurer que le nom de l'entreprise est bien présent
      const offreData = {
        ...formData,
        nom_entreprise: entrepriseNom // Utiliser le nom de l'entreprise connectée
      };

      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/offres/update/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(offreData)
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Erreur lors de la modification");
        }

        setEditingId(null);
      } else {
        const res = await fetch("http://localhost:5000/api/offres/add", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(offreData)
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Erreur lors de l'ajout");
        }
      }

      await fetchOffres();
      
      // ⚡ Réinitialiser le formulaire en gardant le nom de l'entreprise
      setFormData({
        titre: "",
        description: "",
        niveau: "",
        nom_entreprise: entrepriseNom, // Garder le nom
        date_debut: "",
        date_limite: "",
      });

      alert(editingId ? "Offre modifiée avec succès !" : "Offre ajoutée avec succès !");

    } catch (error) {
      console.error(error);
      setError(error.message || "Erreur lors de l'opération");
    }
  };

  const handleEdit = (offre) => {
    setEditingId(offre._id);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      niveau: offre.niveau,
      nom_entreprise: entrepriseNom, // ⚡ Utiliser le nom de l'entreprise connectée
      date_debut: offre.date_debut.split("T")[0],
      date_limite: offre.date_limite.split("T")[0],
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/offres/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setOffres(offres.filter((o) => o._id !== id));
      alert("Offre supprimée avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression !");
    }
  };

  if (loading || loadingEntreprise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              <Briefcase size={40} className="text-blue-700" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {editingId ? "Modifier l'offre" : "Ajouter une offre"}
              </h2>
              <p className="text-gray-600">Gérez vos offres d'emploi pour <span className="font-semibold text-blue-700">{entrepriseNom}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Titre de l'offre *</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Développeur Full Stack"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Niveau *</label>
                <input
                  type="text"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  placeholder="Ex: Bac+5, 3-5 ans d'expérience"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* ⚡ CHAMP ENTREPRISE NON MODIFIABLE */}
              <div>
                <label className="block text-sm text-gray-500 mb-2 flex items-center gap-2">
                  Nom de l'entreprise
                  <Lock size={14} className="text-gray-400" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nom_entreprise"
                    value={formData.nom_entreprise}
                    readOnly
                    disabled
                    className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full text-gray-600 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Ce champ est automatiquement rempli avec votre entreprise</p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Date de début *</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Date limite *</label>
                <input
                  type="date"
                  name="date_limite"
                  value={formData.date_limite}
                  onChange={handleChange}
                  min={formData.date_debut || new Date().toISOString().split('T')[0]}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez le poste, les missions, les compétences requises..."
                  rows="4"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl hover:shadow-lg transition font-medium"
              >
                {editingId ? "Enregistrer les modifications" : "Ajouter l'offre"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      titre: "",
                      description: "",
                      niveau: "",
                      nom_entreprise: entrepriseNom,
                      date_debut: "",
                      date_limite: "",
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Liste des offres - reste identique */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Mes offres ({offres.length})
        </h3>
        
        {offres.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aucune offre publiée pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">Créez votre première offre ci-dessus</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offres.map((offre) => (
              <div
                key={offre._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="h-24 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                      <Briefcase size={24} className="text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800">{offre.titre}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(offre)}
                        className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 rounded-lg hover:shadow transition"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(offre._id)}
                        className="p-2 bg-gradient-to-br from-red-50 to-rose-50 text-red-600 rounded-lg hover:shadow transition"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{offre.description}</p>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <GraduationCap size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Niveau</p>
                        <p className="font-semibold text-gray-800 text-sm">{offre.niveau}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Building2 size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Entreprise</p>
                        <p className="font-semibold text-gray-800 text-sm">{offre.nom_entreprise}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Période</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(offre.date_debut).toLocaleDateString()} - {new Date(offre.date_limite).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffreEmploi;