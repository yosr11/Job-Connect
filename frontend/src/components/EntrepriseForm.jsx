import React, { useState } from "react";
import { Building2, AlertCircle, CheckCircle, X, Loader2 } from "lucide-react";
import api from "../services/axiosConfig.js";

const EntrepriseForm = ({ 
  onEntrepriseCreated, 
  onCancel, 
  initialData = {},
  className = "" 
}) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    nom: initialData.nom || "",
    adresse: initialData.adresse || "",
    secteur: initialData.secteur || "",
    site_web: initialData.site_web || "",
    description: initialData.description || "",
    email: initialData.email || "",     // nouveau champ email
  num_tel: initialData.num_tel || "", // nouveau champ num_tel
  });

  // États pour les messages et le chargement
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Gestionnaire de changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer les messages d'erreur quand l'utilisateur commence à taper
    if (error) {
      setError("");
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const { nom, site_web } = formData;

    // Validation du nom (obligatoire)
    if (!nom || nom.trim() === "") {
      return "Le nom de l'entreprise est obligatoire.";
    }

    if (nom.trim().length < 2) {
      return "Le nom de l'entreprise doit contenir au moins 2 caractères.";
    }

    if (nom.trim().length > 100) {
      return "Le nom de l'entreprise ne peut pas dépasser 100 caractères.";
    }
if (!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
  return "Email valide requis";
}

if (!formData.num_tel || !/^\d{8}$/.test(formData.num_tel)) {
  return "Numéro de téléphone doit contenir exactement 8 chiffres";
}

    // Validation du site web (optionnel)
    if (site_web && site_web.trim() !== "") {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(site_web.trim())) {
        return "Format d'URL invalide (doit commencer par http:// ou https://).";
      }
    }

    return "";
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Effacer les messages précédents
    setMessage("");
    setError("");

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      console.log("🔄 Création de l'entreprise:", formData);
      
      // Appel API
      const { data } = await api.post("/entreprises", formData);
      console.log("📡 Réponse API création entreprise:", data);
      
      if (data.success) {
        const newEntreprise = data.entreprise;
        console.log("✅ Nouvelle entreprise créée:", newEntreprise);
        
        // Message de succès
        setMessage("Entreprise créée avec succès !");
        
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          adresse: "",
          secteur: "",
          site_web: "",
          description: "",
          email: "",
          num_tel: "",
        });
        
        // Appeler la fonction de callback avec la nouvelle entreprise
        if (onEntrepriseCreated) {
          onEntrepriseCreated(newEntreprise);
        }
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          setMessage("");
        }, 3000);
        
      } else {
        console.error("❌ Erreur dans la réponse:", data.message);
        setError(data.message || "Erreur lors de la création de l'entreprise");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la création de l'entreprise:", err);
      
      // Gestion des erreurs de validation
      if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Erreur lors de la création de l'entreprise"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      nom: "",
      adresse: "",
      secteur: "",
      site_web: "",
      description: "",
      email: "",
      num_tel: "",
    });
    setMessage("");
    setError("");
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Créer une nouvelle entreprise
            </h3>
            <p className="text-sm text-gray-500">
              Remplissez les informations de votre entreprise
            </p>
          </div>
        </div>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages de succès et d'erreur */}
      {message && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom de l'entreprise (obligatoire) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Ex: TechCorp Solutions"
            className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            2-100 caractères
          </p>
        </div>

        {/* Secteur et Site web */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Secteur d'activité
            </label>
            <input
              type="text"
              name="secteur"
              value={formData.secteur}
              onChange={handleChange}
              placeholder="Ex: Technologie, Finance, Santé"
              className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Site web
            </label>
            <input
              type="url"
              name="site_web"
              value={formData.site_web}
              onChange={handleChange}
              placeholder="https://www.exemple.com"
              className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optionnel - doit commencer par http:// ou https://
            </p>
          </div>
        </div>
        {/* Email et Numéro de téléphone */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Email *
    </label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="contact@entreprise.com"
      className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
      disabled={isLoading}
    />
    <p className="text-xs text-gray-500 mt-1">
      Email valide requis
    </p>
  </div>

  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Numéro de téléphone *
    </label>
    <input
      type="tel"
      name="num_tel"
      value={formData.num_tel}
      onChange={handleChange}
      placeholder="12345678"
      className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
      disabled={isLoading}
    />
    <p className="text-xs text-gray-500 mt-1">
      8 chiffres requis
    </p>
  </div>
</div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Adresse complète de l'entreprise"
            className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez votre entreprise, ses activités, sa mission..."
            rows="3"
            className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum 500 caractères
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                Créer l'entreprise
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {/* Footer avec informations */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          * Champs obligatoires • Les informations seront vérifiées avant validation
        </p>
      </div>
    </div>
  );
};

export default EntrepriseForm;
