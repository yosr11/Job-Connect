import React, { useEffect, useState } from "react";
import { Mail, Phone, User, FileText, MapPin, Calendar } from "lucide-react";
import axios from "axios";

const ProfilCandidat = () => {
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    num_tel: "",
    mot_de_passe: "",
    date_naissance: "",
    competences: "",
    adresse: "",
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchCandidat = async () => {
      try {
        const candidatId = localStorage.getItem("candidatId");
        const token = localStorage.getItem("token");
        if (!candidatId) return;

        const res = await axios.get(`http://localhost:5000/api/candidat/${candidatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCandidat(res.data);
        setFormData({
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          num_tel: res.data.num_tel,
          mot_de_passe: "",
          date_naissance: res.data.date_naissance?.slice(0, 10) || "",
          competences: res.data.competences || "",
          adresse: res.data.adresse || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidat();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const candidatId = localStorage.getItem("candidatId");
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (cvFile) data.append("cv", cvFile);

      const res = await axios.put(`http://localhost:5000/api/candidat/${candidatId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setCandidat(res.data.candidat);
      setEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;
  if (!candidat) return <p className="p-6 text-red-500">Aucun candidat trouvé</p>;

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
                  {candidat.prenom} {candidat.nom}
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
            {/* Email */}
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
                  <p className="font-semibold text-gray-800">{candidat.email}</p>
                )}
              </div>
            </div>

            {/* Téléphone */}
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
                  <p className="font-semibold text-gray-800">{candidat.num_tel}</p>
                )}
              </div>
            </div>

            {/* Mot de passe */}
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

            {/* Date de naissance */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Calendar size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date de naissance</p>
                {editing ? (
                  <input
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{candidat.date_naissance?.slice(0,10)}</p>
                )}
              </div>
            </div>

            {/* Compétences */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <User size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Compétences</p>
                {editing ? (
                  <input
                    type="text"
                    name="competences"
                    value={formData.competences}
                    onChange={handleChange}
                    className="border p-1 rounded w-full text-gray-800"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{candidat.competences}</p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <MapPin size={20} className="text-blue-400" />
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
                  <p className="font-semibold text-gray-800">{candidat.adresse}</p>
                )}
              </div>
            </div>

            {/* CV */}
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <FileText size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">CV</p>
                {editing ? (
                  <input type="file" name="cv" onChange={handleFileChange} className="border p-1 rounded w-full" />
                ) : (
                  candidat.cv ? (
                    <a href={`http://localhost:5000/${candidat.cv}`} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold">
                      Voir le CV
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-800">Non fourni</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilCandidat;
