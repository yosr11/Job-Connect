import express from "express";
import fs from "fs";
import { getScoreMatch } from "../services/mlClient.js"; // <-- utiliser ton client existant
import multer from "multer";

const router = express.Router();

// Config multer pour upload temporaire de CV si fichier
const upload = multer({ dest: "uploads/" });

/**
 * Test de compatibilité CV <-> Offre
 * Option 1 : envoi de texte directement
 * Option 2 : envoi d'un fichier CV
 */
router.post("/test-score", upload.single("cv_file"), async (req, res) => {
  const { cv_text, offre_text } = req.body;
  const cvFile = req.file; // si upload d'un PDF

  if (!offre_text) {
    return res.status(400).json({ message: "offre_text est requis" });
  }

  try {
    let score = 0;

    if (cvFile) {
      // Si CV uploadé
      score = await getScoreMatch(fs.createReadStream(cvFile.path), offre_text);
      fs.unlinkSync(cvFile.path); // supprimer fichier temporaire après usage
    } else if (cv_text) {
      // Si texte brut fourni
      score = await getScoreMatch(Buffer.from(cv_text, "utf-8"), offre_text);
    } else {
      return res.status(400).json({ message: "cv_text ou cv_file requis" });
    }

    res.json({ score: Math.round(score * 100) }); // pourcentage 0-100
  } catch (error) {
    console.error("❌ Erreur /test-score:", error);
    res.status(500).json({ message: "Erreur ML", error: error.message });
  }
});

export default router;
