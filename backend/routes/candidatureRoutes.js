import express from "express";
import {
  ajouterCandidature,
  getAllCandidatures,
  getCandidaturesByCandidat,
  deleteCandidature,
  getCandidaturesByRecruteur,
  calculateScore, // ⬅️ NOUVEAU
} from "../controllers/candidatureController.js";
import { uploadLettreMotivation } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 NOUVELLE ROUTE : Calculer le score AVANT de postuler
router.get("/calculate-score/:offreId/:candidatId", authMiddleware, calculateScore);

// Ajouter une candidature
router.post("/", authMiddleware, uploadLettreMotivation, ajouterCandidature);

// Récupérer les candidatures d'un candidat
router.get("/candidat/:id_candidat", authMiddleware, getCandidaturesByCandidat);

// Supprimer une candidature
router.delete("/:id", authMiddleware, deleteCandidature);

// Obtenir toutes les candidatures (admin)
router.get("/", authMiddleware, getAllCandidatures);

// Récupérer toutes les candidatures pour les offres du recruteur connecté
router.get('/recruteur/offres', authMiddleware, getCandidaturesByRecruteur);

export default router;