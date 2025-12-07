import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Candidat from "../models/candidat.js";
import Recruteur from "../models/recruteur.js";
import Offre from "../models/offre.js";
import Entreprise from "../models/entreprise.js";
import Candidature from "../models/candidature.js";

// 🔹 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isPasswordValid = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      admin: {
        id: admin._id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔹 CANDIDATS
export const getAllCandidats = async (req, res) => {
  try {
    const candidats = await Candidat.find().sort({ createdAt: -1 });
    res.json(candidats);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const acceptCandidat = async (req, res) => {
  await Candidat.findByIdAndUpdate(req.params.id, { etat: "accepted" });
  res.json({ message: "Candidat accepté !" });
};

export const rejectCandidat = async (req, res) => {
  await Candidat.findByIdAndUpdate(req.params.id, { etat: "rejected" });
  res.json({ message: "Candidat rejeté !" });
};

// 🔹 RECRUTEURS
export const getAllRecruteurs = async (req, res) => {
  try {
    const recruteurs = await Recruteur.find()
      .populate("entreprise")
      .sort({ createdAt: -1 });
    res.json(recruteurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const acceptRecruteur = async (req, res) => {
  await Recruteur.findByIdAndUpdate(req.params.id, { etat: "accepted" });
  res.json({ message: "Recruteur accepté !" });
};

export const rejectRecruteur = async (req, res) => {
  await Recruteur.findByIdAndUpdate(req.params.id, { etat: "rejected" });
  res.json({ message: "Recruteur rejeté !" });
};

// 🔹 OFFRES
export const getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find()
      .populate("entrepriseId")
      .sort({ createdAt: -1 });
    res.json(offres);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔹 ENTREPRISES
export const getEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find();
    res.json(entreprises);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find()
      .populate({
        path: "id_candidat",
        select: "nom prenom email"
      })
      .populate({
        path: "id_offre",
        select: "titre entrepriseId recruteur",
        populate: [
          { 
            path: "entrepriseId", 
            model: "Entreprise",  // ✅ Ajoutez le nom du modèle
            select: "nom" 
          },
          
        ]
      })
      .sort({ date_postulation: -1 });
    
    console.log("✅ Candidatures récupérées:", candidatures); // Pour déboguer
    res.json(candidatures);
  } catch (error) {
    console.error("❌ Erreur candidatures:", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔹 STATISTIQUES
export const getStats = async (req, res) => {
  const candidats = await Candidat.countDocuments();
  const recruteurs = await Recruteur.countDocuments();
  const offres = await Offre.countDocuments({ etat: "active" });

  res.json({
    totalCandidats: candidats,
    totalRecruteurs: recruteurs,
    offresActives: offres,
  });
};
