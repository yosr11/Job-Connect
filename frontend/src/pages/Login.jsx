import React, { useState } from "react";
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Home, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("candidat");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate(); 
  
  // États pour mot de passe oublié
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotRole, setForgotRole] = useState("candidat");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!validateEmail(email)) {
    setEmailError("Adresse email invalide");
    return;
  } else {
    setEmailError("");
  }

  setIsLoading(true);

  try {
    let url;
    if (role === "candidat") {
      url = `${API_URL}/candidat/login`;
    } else if (role === "recruteur") {
      url = `${API_URL}/recruteur/login`;
    } else if (role === "admin") {
      url = `${API_URL}/admin/login`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        mot_de_passe: motDePasse,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur de connexion");
    }

    // ✅ Cas recruteur - VERSION CORRIGÉE
if (role === "recruteur") {
  const recruteur = data.recruteur;
  
  // Vérification des données reçues
  if (!recruteur || !recruteur._id || !data.token) {
    console.error("❌ Données manquantes dans la réponse:", data);
    throw new Error("Identifiant recruteur ou token manquant");
  }

  console.log("✅ Recruteur connecté:", recruteur);
  console.log("✅ Token reçu:", data.token);
  console.log("✅ EntrepriseId:", recruteur.entrepriseId);

  // ⚡ STOCKAGE COMPLET - TRÈS IMPORTANT
  localStorage.setItem("token", data.token);                    // ← Token JWT
  localStorage.setItem("role", "recruteur");                    // ← Rôle
  localStorage.setItem("recruteurId", recruteur._id);           // ← ID du recruteur
  localStorage.setItem("recruteurNom", recruteur.nom);          // ← Nom
  localStorage.setItem("recruteurPrenom", recruteur.prenom);    // ← Prénom
  localStorage.setItem("recruteurEmail", recruteur.email);      // ← Email
  localStorage.setItem("entrepriseId", recruteur.entrepriseId); // ← ID entreprise
  localStorage.setItem("user", JSON.stringify(recruteur));      // ← Objet complet

  console.log("✅ Données stockées dans localStorage");

  // Redirection
  navigate("/dashboard-recruteur");
  return;
}
  
    // ✅ Cas candidat - VERSION CORRIGÉE
if (role === "candidat") {
  const candidat = data.candidat || data.user;
  
  if (!candidat || !data.token) {
    console.error("❌ Token ou candidat manquant:", data);
    throw new Error("Token ou ID candidat manquant");
  }

  console.log("✅ Connexion candidat réussie");
  console.log("- Token:", data.token);
  console.log("- Candidat:", candidat);

  // ⚡ IMPORTANT : Nettoyer le localStorage d'abord
  localStorage.clear();
  
  // ⚡ Stockage complet avec le ROLE
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", "candidat"); // ← CETTE LIGNE EST CRUCIALE !
  localStorage.setItem("candidatId", candidat._id || candidat.id);
  localStorage.setItem("candidatNom", candidat.nom);
  localStorage.setItem("candidatPrenom", candidat.prenom);
  localStorage.setItem("candidatEmail", candidat.email);
  localStorage.setItem("user", JSON.stringify(candidat));

  console.log("✅ Stockage terminé, redirection...");

  setTimeout(() => {
    navigate("/dashboard-candidat");
  }, 100);
  
  return;
}

    // ✅ Cas admin
    if (role === "admin") {
      const admin = data.admin || data.user;
       
  // ✅ SAUVEGARDER LE TOKEN (c'est ça qui manquait !)
  localStorage.setItem("token", data.token);
      sessionStorage.setItem("admin", JSON.stringify(admin));
      navigate("/dashboard-admin");
      return;
    }

  } catch (error) {
    console.error("Erreur login:", error);
    setMessage(error.message || "Erreur de connexion");
  } finally {
    setIsLoading(false);
  }
};

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    if (!validateEmail(forgotEmail)) {
      setForgotError("Adresse email invalide");
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
          role: forgotRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi");
      }

      setForgotMessage(data.message || "Email envoyé avec succès ! Vérifiez votre boîte mail.");
      setForgotEmail("");
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotMessage("");
      }, 5000);
    } catch (error) {
      setForgotError(error.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setIsSendingReset(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="relative w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotMessage("");
                setForgotError("");
                setForgotEmail("");
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Retour à la connexion</span>
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mot de passe oublié
              </h2>
              <p className="text-gray-500 mt-2">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Vous êtes</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotRole("candidat")}
                    className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                      forgotRole === "candidat"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Candidat
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotRole("recruteur")}
                    className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                      forgotRole === "recruteur"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Recruteur
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {forgotMessage && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{forgotMessage}</span>
                </div>
              )}

              {forgotError && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{forgotError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSendingReset ? "Envoi en cours..." : "Envoyer le lien"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.location.href = "/"}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
              >
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bienvenue
            </h2>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Vous êtes</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("candidat")}
                  className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                    role === "candidat"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Candidat
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruteur")}
                  className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm ${
                    role === "recruteur"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Recruteur
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-3 px-3 rounded-xl font-medium transition-all duration-200 text-sm flex items-center justify-center gap-1 ${
                    role === "admin"
                      ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Adresse email {role === "admin" && "(admin)"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "admin" ? "admin@jobconnect.com" : "nom@exemple.com"}
                  required
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 ${
                    emailError ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Mot de passe {role === "admin" && "(admin)"}
                </label>
                {role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.includes("réussie")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.includes("réussie") ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            <button
              type="submit"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => window.location.href = "/register"}
            >
              S'inscrire
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.location.href = "/"}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;