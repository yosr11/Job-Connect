import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  ajouterOffre,
  modifierOffre,
  supprimerOffre,
  getAllOffres,
  getOffreById,
  getOffresValides,
  getOffresRecruteur,
  getCandidatById
} from "../controllers/offreController.js";

const router = express.Router();

// Routes spécifiques pour recruteur
router.get("/mes-offres", authMiddleware, getOffresRecruteur);

// Recruteur : opérations protégées
router.post("/add", authMiddleware, ajouterOffre);
router.put("/update/:id", authMiddleware, modifierOffre);
router.delete("/delete/:id", authMiddleware, supprimerOffre);

// Public (candidats)
router.get("/filtrer/valides", getOffresValides);
router.get("/", getAllOffres);
router.get("/:id", getOffreById);
router.get("/:id", authMiddleware, getCandidatById);

export default router;
