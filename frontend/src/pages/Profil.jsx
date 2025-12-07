import React, { useEffect, useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import axios from "axios";

const Profil = () => {
  const [recruteur, setRecruteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    num_tel: "",
    email: "",
    mot_de_passe: "",
  });

  useEffect(() => {
    const fetchRecruteur = async () => {
      try {
        const recruteurId = localStorage.getItem("recruteurId");
        if (!recruteurId) return;

        const res = await axios.get(`http://localhost:5000/api/recruteur/${recruteurId}`);
        console.log(res.data);
        setRecruteur(res.data || {});
        setFormData({
          nom: res.data.nom,
          prenom: res.data.prenom,
          num_tel: res.data.num_tel,
          email: res.data.email,
          mot_de_passe: "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruteur();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recruteurId = localStorage.getItem("recruteurId");
      const res = await axios.put(`http://localhost:5000/api/recruteur/${recruteurId}`, formData);
      setRecruteur(res.data);
      setEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;
  if (!recruteur) return <p className="p-6 text-red-500">Aucun recruteur trouvé</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              <User size={50} className="text-blue-800" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="border p-2 rounded text-2xl font-bold w-1/2"
                    placeholder="Prénom"
                  />
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="border p-2 rounded text-2xl font-bold w-1/2"
                    placeholder="Nom"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {recruteur.prenom} {recruteur.nom}
                </h2>
              )}
            </div>

            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:shadow-lg transition font-medium"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:shadow transition font-medium"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl hover:shadow-lg transition font-medium"
              >
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
                <p className="text-sm text-gray-500 mb-1">Email</p>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{recruteur.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                {editing ? (
                  <input
                    type="text"
                    name="num_tel"
                    value={formData.num_tel}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{recruteur.num_tel}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <User size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mot de passe</p>
                {editing ? (
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                    placeholder="Nouveau mot de passe"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">********</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <User size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Entreprise</p>
                <p className="font-semibold text-gray-800">{recruteur.entreprise?.nom}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
