import Candidature from "../models/candidature.js";
import Offre from "../models/offre.js";
import Candidat from "../models/candidat.js";
import { getScoreMatch } from "../services/mlClient.js";
import fs from "fs";

// 🔥 NOUVELLE FONCTION : Calculer le score AVANT de postuler
export const calculateScore = async (req, res) => {
  try {
    const { offreId, candidatId } = req.params;

    console.log("🔍 Calcul score pour offre:", offreId, "candidat:", candidatId);

    // 1️⃣ Récupérer le candidat
    const candidat = await Candidat.findById(candidatId);
    if (!candidat) {
      return res.status(404).json({ message: "Candidat introuvable" });
    }

    // 2️⃣ Vérifier que le candidat a un CV
    if (!candidat.cv) {
      return res.status(400).json({ 
        message: "Vous devez d'abord uploader votre CV dans votre profil" 
      });
    }

    // 3️⃣ Récupérer l'offre
    const offre = await Offre.findById(offreId);
    if (!offre) {
      return res.status(404).json({ message: "Offre introuvable" });
    }

    // 4️⃣ Vérifier que le fichier CV existe
    const cvPath = candidat.cv; // ex: "uploads/cv/cv-123456.pdf"
    
    if (!fs.existsSync(cvPath)) {
      return res.status(400).json({ 
        message: "Fichier CV introuvable. Veuillez ré-uploader votre CV." 
      });
    }

    // 5️⃣ Appeler FastAPI pour calculer le score
    const jobText = `${offre.titre} ${offre.description}`;
    const cvStream = fs.createReadStream(cvPath);

    console.log("📡 Appel FastAPI...");

    const scoreData = await getScoreMatch(cvStream, jobText);

    console.log("✅ Score calculé:", scoreData.best_score);

    // 6️⃣ Retourner le résultat
    res.json({
      score: scoreData.best_score,
      best_sentence: scoreData.best_sentence,
      common_keywords: scoreData.common_keywords,
      missing_keywords: scoreData.missing_keywords
    });

  } catch (error) {
    console.error("❌ Erreur calcul score:", error.message);
    res.status(500).json({ 
      message: "Erreur lors du calcul du score", 
      error: error.message 
    });
  }
};

// ➕ Ajouter une candidature (postuler)
export const ajouterCandidature = async (req, res) => {
  console.log("📥 Body reçu:", req.body);
  console.log("📎 Fichier reçu:", req.file);

  try {
    const { id_offre, id_candidat, score } = req.body;

    // Vérifier si l'offre et le candidat existent
    const offre = await Offre.findById(id_offre);
    const candidat = await Candidat.findById(id_candidat);

    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    if (!candidat) return res.status(404).json({ message: "Candidat non trouvé" });

    // Vérifier si candidature existe déjà
    const existe = await Candidature.findOne({ id_offre, id_candidat });
    if (existe)
      return res.status(400).json({ message: "Candidature déjà existante pour cette offre" });

    // Récupérer le chemin du fichier
    const lettre_motivation_fichier = req.file ? req.file.path : null;

    // Créer la candidature
    const candidature = new Candidature({
      id_offre,
      id_candidat,
      score: score || 0,
      date_postulation: new Date(),
      etat: "en attente",
      lettre_motivation_fichier,
    });

    await candidature.save();

    console.log("✅ Candidature créée:", candidature);

    res.status(201).json({
      message: "Candidature ajoutée avec succès",
      candidature,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔍 Obtenir toutes les candidatures
export const getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find()
      .populate("id_candidat", "nom prenom email")
      .populate({
        path: "id_offre",
        select: "titre entrepriseId recruteur",
        populate: [
          { path: "entrepriseId", select: "nom" },
          { path: "recruteur", select: "nom" }
        ]
      })
      .sort({ createdAt: -1 });
    
    res.json(candidatures);
  } catch (error) {
    console.error("❌ Erreur candidatures:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 📋 Récupérer les candidatures d'un candidat spécifique
export const getCandidaturesByCandidat = async (req, res) => {
  try {
    const { id_candidat } = req.params;

    console.log("🔍 Recherche des candidatures pour candidat ID:", id_candidat);

    const candidatures = await Candidature.find({ id_candidat })
      .populate("id_offre", "titre nom_entreprise description date_debut niveau")
      .sort({ date_postulation: -1 });

    console.log(`✅ ${candidatures.length} candidature(s) trouvée(s)`);

    res.status(200).json({
      message: "Candidatures du candidat récupérées avec succès",
      count: candidatures.length,
      candidatures,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🗑️ Supprimer une candidature
export const deleteCandidature = async (req, res) => {
  try {
    const { id } = req.params;

    const candidature = await Candidature.findByIdAndDelete(id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: "Candidature supprimée avec succès",
      candidature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔹 Récupérer toutes les candidatures pour les offres du recruteur connecté
export const getCandidaturesByRecruteur = async (req, res) => {
  try {
    const recruteurId = req.user.id;
    const entrepriseId = req.user.entrepriseId;

    if (!entrepriseId) {
      return res.status(400).json({ message: "Aucune entreprise associée à ce recruteur" });
    }

    console.log("🔍 Récupération des candidatures pour l'entreprise:", entrepriseId);

    // Récupérer toutes les offres de l'entreprise
    const offres = await Offre.find({ entrepriseId }).select('_id');
    const offreIds = offres.map(o => o._id);

    // Récupérer toutes les candidatures pour ces offres
    const candidatures = await Candidature.find({ id_offre: { $in: offreIds } })
      .populate("id_candidat", "nom prenom email cv_text")
      .populate({
        path: "id_offre",
        select: "titre entrepriseId recruteur",
        populate: { path: "entrepriseId", select: "nom" }
      })
      .sort({ date_postulation: -1 });

    console.log(`✅ ${candidatures.length} candidature(s) trouvée(s)`);

    res.status(200).json({ candidatures });
  } catch (error) {
    console.error("❌ Erreur getCandidaturesByRecruteur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};