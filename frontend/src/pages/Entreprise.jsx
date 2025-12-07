import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Globe, Target } from "lucide-react";
import axios from "axios";

const Entreprise = () => {
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
     nom: "",
    adresse: "",
    secteur: "",
    site_web: "",
    description: "",
    email: "",
    num_tel: "",
    logo: null,
  });

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const recruteurId = localStorage.getItem("recruteurId");
        if (!recruteurId) return;

        const res = await axios.get(`http://localhost:5000/api/recruteur/entreprise/${recruteurId}`);
        setEntreprise(res.data.entreprise);
        setFormData({
          nom: res.data.entreprise.nom,
          adresse: res.data.entreprise.adresse,
          secteur: res.data.entreprise.secteur,
          site_web: res.data.entreprise.site_web,
          description: res.data.entreprise.description,
          num_tel: res.data.entreprise.num_tel ,
          logo: null,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntreprise();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData({ ...formData, [name]: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recruteurId = localStorage.getItem("recruteurId");
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) data.append(key, formData[key]);
      }

      const res = await axios.put(`http://localhost:5000/api/recruteur/entreprise/${recruteurId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEntreprise(res.data.entreprise);
      setEditing(false);
      alert("Entreprise mise à jour !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;
  if (!entreprise) return <p className="p-6 text-red-500">Aucune entreprise trouvée</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              {editing ? (
                <input type="file" name="logo" onChange={handleChange} />
              ) : (
                <img src={`http://localhost:5000/${entreprise.logo.startsWith('/') ? entreprise.logo.slice(1) : entreprise.logo}`} alt={entreprise.nom} className="w-20 h-20"/>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              {editing ? (
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="border p-2 rounded text-2xl font-bold w-full"
                />
              ) : (
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{entreprise.nom}</h2>
              )}
              {editing ? (
                <input
                  type="text"
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleChange}
                  className="border p-1 rounded w-full text-gray-600"
                />
              ) : (
                <p className="text-gray-600 flex items-center gap-2">
                  <Target size={16} className="text-blue-700" /> {entreprise.secteur}
                </p>
              )}
            </div>
            {editing ? (
              <div className="flex gap-2">
                <button onClick={handleSubmit} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:shadow-lg transition font-medium">Enregistrer</button>
                <button onClick={() => setEditing(false)} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:shadow transition font-medium">Annuler</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl hover:shadow-lg transition font-medium">
                Modifier le profil
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Mail size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email professionnel</p>
                <p className="font-semibold text-gray-800">{entreprise.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                <p className="font-semibold text-gray-800">{entreprise.num_tel}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <MapPin size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Adresse</p>
                {editing ? (
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{entreprise.adresse}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Globe size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Site web</p>
                {editing ? (
                  <input
                    type="text"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{entreprise.site_web}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">À propos de l'entreprise</h3>
            {editing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full text-gray-800"
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{entreprise.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entreprise;
