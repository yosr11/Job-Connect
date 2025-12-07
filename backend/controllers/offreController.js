// 📁 controllers/offreController.js
import Offre from "../models/offre.js";
import Candidat from "../models/candidat.js";
import axios from "axios";
import { getEmbedding } from "../services/mlClient.js";

const ML_SERVICE = process.env.ML_SERVICE || "http://localhost:8000";

export const ajouterOffre = async (req, res) => {
  try {
    const entrepriseId = req.user.entrepriseId;

    if (!entrepriseId) {
      return res.status(400).json({ 
        message: "Aucune entreprise associée à ce recruteur" 
      });
    }

    const offre = new Offre({
      ...req.body,
      entrepriseId
    });

    await offre.save();

    // Générer l'embedding (optionnel)
    try {
      const text = `${offre.titre} ${offre.description}`;
      const embedding = await getEmbedding(text);
      
      if (embedding.length > 0) {
        offre.embedding = embedding;
        await offre.save();
      }
    } catch (err) {
      console.error("❌ Erreur embedding ML:", err.message);
    }

    res.status(201).json({
      message: "Offre ajoutée avec succès",
      offre
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifierOffre = async (req, res) => {
  try {
    const oldOffre = await Offre.findById(req.params.id);
    if (!oldOffre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    const updatedOffre = await Offre.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    res.json({ 
      message: "Offre mise à jour avec succès", 
      updatedOffre 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const supprimerOffre = async (req, res) => {
  try {
    const offre = await Offre.findByIdAndDelete(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    res.json({ message: "Offre supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().sort({ createdAt: -1 });
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOffreById = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    res.json(offre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOffresRecruteur = async (req, res) => {
  try {
    const recruteurEntrepriseId = req.user.entrepriseId;
    const offres = await Offre.find({ entrepriseId: recruteurEntrepriseId })
      .sort({ createdAt: -1 });
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOffresValides = async (req, res) => {
  try {
    const today = new Date();
    const offres = await Offre.find({ date_limite: { $gte: today } });
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCandidatById = async (req, res) => {
  try {
    const candidat = await Candidat.findById(req.params.id);
    if (!candidat) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }
    res.json(candidat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};