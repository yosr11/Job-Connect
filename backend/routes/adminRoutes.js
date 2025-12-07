import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
  loginAdmin,
  getAllCandidats,
  acceptCandidat,
  rejectCandidat,
  getAllRecruteurs,
  acceptRecruteur,
  rejectRecruteur,
  getAllOffres,
  getAllCandidatures,
  getEntreprises,
  getStats
} from "../controllers/adminController.js";

const router = express.Router();

// 🔹 Auth
router.post("/login", loginAdmin);

// 🔹 Candidats
router.get("/candidats", authMiddleware, isAdmin, getAllCandidats);
router.put("/candidats/:id/accept", authMiddleware, isAdmin, acceptCandidat);
router.put("/candidats/:id/reject", authMiddleware, isAdmin, rejectCandidat);

// 🔹 Recruteurs
router.get("/recruteurs", authMiddleware, isAdmin, getAllRecruteurs);
router.put("/recruteurs/:id/accept", authMiddleware, isAdmin, acceptRecruteur);
router.put("/recruteurs/:id/reject", authMiddleware, isAdmin, rejectRecruteur);

// 🔹 Offres
router.get("/offres", authMiddleware, isAdmin, getAllOffres);

// 🔹 Entreprises
router.get("/entreprises", authMiddleware, isAdmin, getEntreprises);

// 🔹 Candidatures
router.get("/candidatures", authMiddleware, isAdmin, getAllCandidatures);

// 🔹 Statistiques
router.get("/stats", authMiddleware, isAdmin, getStats);

export default router;
