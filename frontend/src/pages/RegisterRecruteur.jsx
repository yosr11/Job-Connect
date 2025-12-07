import React, { useState, useEffect } from "react";
import { Building2, Mail, Lock, Phone, AlertCircle, CheckCircle, Plus, X, ChevronDown, Home, MapPin, Globe, FileText, Upload } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData }, message: errorData.message };
    }
    
    return { data: await response.json() };
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData }, message: errorData.message };
    }
    
    return { data: await response.json() };
  },
  postFormData: async (endpoint, formData) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData }, message: errorData.message };
    }
    
    return { data: await response.json() };
  },
};

export default function RegisterRecruteur() {
  const [recruteurForm, setRecruteurForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    num_tel: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    entreprise_id: "",
  });

  const [entrepriseForm, setEntrepriseForm] = useState({
    nom: "",
    adresse: "",
    secteur: "",
    site_web: "",
    description: "",
    email: "",
  num_tel: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showCreateEntreprise, setShowCreateEntreprise] = useState(false);
  
  const [recruteurMessage, setRecruteurMessage] = useState("");
  const [recruteurError, setRecruteurError] = useState("");
  const [entrepriseMessage, setEntrepriseMessage] = useState("");
  const [entrepriseError, setEntrepriseError] = useState("");
  
  const [isLoadingRecruteur, setIsLoadingRecruteur] = useState(false);
  const [isLoadingEntreprise, setIsLoadingEntreprise] = useState(false);
  const [isLoadingEntreprises, setIsLoadingEntreprises] = useState(false);

  useEffect(() => {
    loadEntreprises();
  }, []);

  const loadEntreprises = async () => {
    try {
      setIsLoadingEntreprises(true);
      const { data } = await api.get("/entreprises");
      
      if (data.success) {
        setEntreprises(data.entreprises);
      } else {
        setRecruteurError("Erreur lors du chargement des entreprises");
      }
    } catch (err) {
      setRecruteurError("Erreur lors du chargement des entreprises");
    } finally {
      setIsLoadingEntreprises(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setEntrepriseError("Format de fichier non supporté. Utilisez JPG, PNG, GIF, WEBP ou SVG.");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setEntrepriseError("Le fichier est trop volumineux (max 5MB)");
        return;
      }
      
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setEntrepriseError("");
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const validateRecruteur = () => {
    const { nom, prenom, email, num_tel, mot_de_passe, confirmer_mot_de_passe, entreprise_id } = recruteurForm;
    
    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe || !entreprise_id) {
      return "Veuillez remplir tous les champs obligatoires.";
    }
    
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return "Adresse email invalide.";
    }
    
    if (!/^\d{8}$/.test(num_tel)) {
      return "Le numéro de téléphone doit contenir exactement 8 chiffres.";
    }
    
    if (mot_de_passe.length < 6) {
      return "Mot de passe trop court (6 caractères minimum).";
    }
    
    if (mot_de_passe !== confirmer_mot_de_passe) {
      return "Les mots de passe ne correspondent pas.";
    }
    
    return "";
  };

  const validateEntreprise = () => {
    const { nom, site_web } = entrepriseForm;

    if (!nom || nom.trim() === "") {
      return "Le nom de l'entreprise est obligatoire.";
    }

    if (nom.trim().length < 2) {
      return "Le nom doit contenir au moins 2 caractères.";
    }

    if (nom.trim().length > 100) {
      return "Le nom ne peut pas dépasser 100 caractères.";
    }

    if (site_web && site_web.trim() !== "") {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(site_web.trim())) {
        return "L'URL doit commencer par http:// ou https://";
      }
    }
 

    return "";
  };

  const onChangeRecruteur = (e) => {
    setRecruteurForm({ ...recruteurForm, [e.target.name]: e.target.value });
    if (recruteurError) {
      setRecruteurError("");
    }
  };

  const onChangeEntreprise = (e) => {
    setEntrepriseForm({ ...entrepriseForm, [e.target.name]: e.target.value });
    if (entrepriseError) {
      setEntrepriseError("");
    }
  };

  const handleEntrepriseSelect = (entreprise) => {
    setSelectedEntreprise(entreprise);
    setRecruteurForm({ ...recruteurForm, entreprise_id: entreprise._id });
    setShowCreateEntreprise(false);
  };

  const handleCreateEntreprise = async () => {
    setEntrepriseMessage("");
    setEntrepriseError("");
    setIsLoadingEntreprise(true);

    const validationError = validateEntreprise();
    if (validationError) {
      setEntrepriseError(validationError);
      setIsLoadingEntreprise(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nom', entrepriseForm.nom.trim());
      formData.append('adresse', entrepriseForm.adresse.trim());
      formData.append('secteur', entrepriseForm.secteur.trim());
      formData.append('site_web', entrepriseForm.site_web.trim());
      formData.append('description', entrepriseForm.description.trim());
      formData.append('email', entrepriseForm.email.trim());
formData.append('num_tel', entrepriseForm.num_tel.trim());

      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const { data } = await api.postFormData("/entreprises", formData);

      if (data.success) {
        setEntrepriseMessage("Entreprise créée avec succès !");
        setEntreprises([...entreprises, data.entreprise]);
        handleEntrepriseSelect(data.entreprise);

        setEntrepriseForm({
          nom: "",
          adresse: "",
          secteur: "",
          site_web: "",
          description: "",
        });
        
        setLogoFile(null);
        setLogoPreview(null);

        setTimeout(() => {
          setShowCreateEntreprise(false);
          setEntrepriseMessage("");
        }, 2000);
      } else {
        setEntrepriseError(data.message || "Erreur lors de la création de l'entreprise");
      }
    } catch (err) {
      setEntrepriseError(
        err?.response?.data?.message || err?.message || "Erreur serveur"
      );
    } finally {
      setIsLoadingEntreprise(false);
    }
  };

  const handleCreateRecruteur = async (e) => {
    e.preventDefault();
    setRecruteurMessage("");
    setRecruteurError("");
    setIsLoadingRecruteur(true);

    const validationError = validateRecruteur();
    if (validationError) {
      setRecruteurError(validationError);
      setIsLoadingRecruteur(false);
      return;
    }

    try {
      const { data } = await api.post("/recruteur/register", recruteurForm);
      
      if (data.success) {
         if (data.token) {
    localStorage.setItem("token", data.token);
  }
        setRecruteurMessage("Recruteur créé avec succès !");
        
        setRecruteurForm({
          nom: "",
          prenom: "",
          email: "",
          num_tel: "",
          mot_de_passe: "",
          confirmer_mot_de_passe: "",
          entreprise_id: "",
        });
        setSelectedEntreprise(null);
        
        setTimeout(() => {
          setRecruteurMessage("");
        }, 5000);
      } else {
        setRecruteurError(data.message || "Erreur lors de la création du recruteur");
      }
    } catch (err) {
      setRecruteurError(
        err?.response?.data?.message || err?.message || "Erreur serveur"
      );
    } finally {
      setIsLoadingRecruteur(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(recrutement.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscription Recruteur
            </h2>
            <p className="text-gray-500 mt-2">
              Créez votre compte pour publier vos offres d'emploi
            </p>
          </div>

          <form onSubmit={handleCreateRecruteur} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nom *</label>
                <input
                  name="nom"
                  value={recruteurForm.nom}
                  onChange={onChangeRecruteur}
                  placeholder="Nom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Prénom *</label>
                <input
                  name="prenom"
                  value={recruteurForm.prenom}
                  onChange={onChangeRecruteur}
                  placeholder="Prénom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Adresse email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={recruteurForm.email}
                  onChange={onChangeRecruteur}
                  placeholder="nom@entreprise.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Numéro de téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="num_tel"
                  value={recruteurForm.num_tel}
                  onChange={onChangeRecruteur}
                  placeholder="8 chiffres"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={recruteurForm.mot_de_passe}
                    onChange={onChangeRecruteur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Confirmer *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmer_mot_de_passe"
                    value={recruteurForm.confirmer_mot_de_passe}
                    onChange={onChangeRecruteur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Entreprise *
              </label>
              {isLoadingEntreprises ? (
                <div className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-center text-gray-500">
                  Chargement...
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      name="entreprise_id"
                      value={recruteurForm.entreprise_id}
                      onChange={(e) => {
                        const entreprise = entreprises.find(emp => emp._id === e.target.value);
                        if (entreprise) {
                          handleEntrepriseSelect(entreprise);
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Sélectionnez une entreprise</option>
                      {entreprises.map((entreprise) => (
                        <option key={entreprise._id} value={entreprise._id}>
                          {entreprise.nom}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateEntreprise(!showCreateEntreprise);
                      setEntrepriseError("");
                      setEntrepriseMessage("");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all"
                  >
                    {showCreateEntreprise ? (
                      <>
                        <X className="w-4 h-4" />
                        <span className="text-sm font-medium">Annuler</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Créer une nouvelle entreprise</span>
                      </>
                    )}
                  </button>

                  {showCreateEntreprise && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <h4 className="text-lg font-bold text-gray-900">
                            Créer une entreprise
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nom *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="nom"
                              value={entrepriseForm.nom}
                              onChange={onChangeEntreprise}
                              placeholder="Ex: Tech Solutions"
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Logo
                          </label>
                          
                          {!logoPreview ? (
                            <div className="relative">
                              <input
                                type="file"
                                id="logo-upload"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                                onChange={handleLogoChange}
                                className="hidden"
                              />
                              <label
                                htmlFor="logo-upload"
                                className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                              >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600 font-medium">
                                  Télécharger un logo
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  JPG, PNG, GIF (max 5MB)
                                </span>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 border-2 border-green-200 rounded-lg bg-green-50">
                              <img
                                src={logoPreview}
                                alt="Logo"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {logoFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(logoFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Adresse
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                name="adresse"
                                value={entrepriseForm.adresse}
                                onChange={onChangeEntreprise}
                                placeholder="Tunis"
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Secteur
                            </label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                name="secteur"
                                value={entrepriseForm.secteur}
                                onChange={onChangeEntreprise}
                                placeholder="IT"
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Site web
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="url"
                              name="site_web"
                              value={entrepriseForm.site_web}
                              onChange={onChangeEntreprise}
                              placeholder="https://exemple.com"
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
<div className="grid grid-cols-2 gap-2">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="email"
        name="email"
        value={entrepriseForm.email}
        onChange={onChangeEntreprise}
        placeholder="contact@entreprise.com"
        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        name="num_tel"
        value={entrepriseForm.num_tel}
        onChange={onChangeEntreprise}
        placeholder="Ex: 12345678"
        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
      />
    </div>
  </div>
</div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={entrepriseForm.description}
                            onChange={onChangeEntreprise}
                            placeholder="Description..."
                            rows="2"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-sm"
                          />
                        </div>

                        {entrepriseMessage && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{entrepriseMessage}</span>
                          </div>
                        )}

                        {entrepriseError && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{entrepriseError}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleCreateEntreprise}
                          disabled={isLoadingEntreprise}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70 text-sm"
                        >
                          {isLoadingEntreprise ? "Création..." : "Créer l'entreprise"}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedEntreprise && !showCreateEntreprise && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {selectedEntreprise.nom}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {recruteurMessage && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{recruteurMessage}</span>
              </div>
            )}
            
            {recruteurError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{recruteurError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingRecruteur}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70"
            >
              {isLoadingRecruteur ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Déjà inscrit ?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}