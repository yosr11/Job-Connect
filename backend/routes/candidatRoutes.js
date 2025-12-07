import express from "express";
import {
  loginCandidat,
  registerCandidat,
  getCandidat,
  updateCandidat,
  uploadcv, // fonction qui gère extraction + embedding du CV
} from "../controllers/candidatController.js";

import { uploadCv } from "../middleware/upload.js"; // ✅ middleware multer pour CV
import { authMiddleware } from "../middleware/authMiddleware.js"; // protection des routes

const router = express.Router();

// ----------------------------
// ROUTES CANDIDAT
// ----------------------------

// Authentification
router.post("/login", loginCandidat);

// Inscription + upload CV (optionnel)
router.post("/register", uploadCv, registerCandidat);

// Récupérer profil d’un candidat
router.get("/:id", authMiddleware, getCandidat);

// Mettre à jour profil + upload CV
router.put("/:id", authMiddleware, uploadCv, updateCandidat);

// Upload CV séparé (embedding + texte)
router.post("/upload-cv/:id", authMiddleware, uploadCv, uploadcv);

export default router;
