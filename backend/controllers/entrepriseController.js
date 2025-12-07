import Entreprise from "../models/entreprise.js";
import fs from 'fs';
import path from 'path';

// Fonction helper pour supprimer un fichier
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Créer une nouvelle entreprise
export const createEntreprise = async (req, res) => {
  try {
    const { nom, adresse, secteur, site_web, description, email, num_tel } = req.body;
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;

    // Validation minimale
    if (!nom || nom.trim() === "") {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ success: false, message: "Le nom de l'entreprise est obligatoire" });
    }

    // Vérifier si l'email existe déjà
    if (email) {
      const existingEmail = await Entreprise.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({ success: false, message: "Cet email d'entreprise existe déjà" });
      }
    }

    // Créer l'entreprise
    const entreprise = await Entreprise.create({
      nom: nom.trim(),
      adresse: adresse?.trim() || "",
      secteur: secteur?.trim() || "",
      site_web: site_web?.trim() || "",
      description: description?.trim() || "",
      logo,
      email: email?.trim() || "",
      num_tel: num_tel?.trim() || "",
    });

    return res.status(201).json({ success: true, message: "Entreprise créée avec succès", entreprise });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    console.error(error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Récupérer toutes les entreprises
export const getAllEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find({})
      .select('_id nom adresse secteur site_web description logo email num_tel date_creation')
      .sort({ nom: 1 });

    console.log("✅ Entreprises récupérées:", entreprises.length, "entreprises");
    return res.status(200).json({
      success: true,
      message: "Entreprises récupérées avec succès",
      entreprises: entreprises.map(e => ({
        id: e._id,
        _id: e._id,
        nom: e.nom,
        adresse: e.adresse,
        secteur: e.secteur,
        site_web: e.site_web,
        description: e.description,
        logo: e.logo,
        email: e.email,
        num_tel: e.num_tel,
        date_creation: e.date_creation,
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des entreprises",
      error: error.message,
    });
  }
};

// Récupérer une entreprise par ID
export const getEntrepriseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ success: false, message: "ID de l'entreprise requis" });

    const entreprise = await Entreprise.findById(id)
      .select('_id nom adresse secteur site_web description logo email num_tel date_creation');

    if (!entreprise) return res.status(404).json({ success: false, message: "Entreprise non trouvée" });

    return res.status(200).json({ success: true, message: "Entreprise récupérée avec succès", entreprise });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour une entreprise
export const updateEntreprise = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, secteur, site_web, description, email, num_tel } = req.body;
    const newLogo = req.file ? `/uploads/logos/${req.file.filename}` : null;

    if (!id) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ success: false, message: "ID de l'entreprise requis" });
    }

    const entreprise = await Entreprise.findById(id);
    if (!entreprise) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ success: false, message: "Entreprise non trouvée" });
    }

    // Vérifier si le nouveau nom ou email existe déjà
    if (nom && nom.trim() !== entreprise.nom) {
      const existingNom = await Entreprise.findOne({ nom: nom.trim() });
      if (existingNom) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({ success: false, message: "Une entreprise avec ce nom existe déjà" });
      }
    }
    if (email && email.trim() !== entreprise.email) {
      const existingEmail = await Entreprise.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({ success: false, message: "Cet email d'entreprise existe déjà" });
      }
    }

    // Supprimer l'ancien logo si un nouveau est uploadé
    if (newLogo && entreprise.logo) {
      const oldLogoPath = path.join('.', entreprise.logo);
      deleteFile(oldLogoPath);
    }

    // Mise à jour
    const updatedEntreprise = await Entreprise.findByIdAndUpdate(
      id,
      {
        nom: nom?.trim() || entreprise.nom,
        adresse: adresse?.trim() || entreprise.adresse,
        secteur: secteur?.trim() || entreprise.secteur,
        site_web: site_web?.trim() || entreprise.site_web,
        description: description?.trim() || entreprise.description,
        logo: newLogo || entreprise.logo,
        email: email?.trim() || entreprise.email,
        num_tel: num_tel?.trim() || entreprise.num_tel,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Entreprise mise à jour avec succès",
      entreprise: updatedEntreprise,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    if (req.file) deleteFile(req.file.path);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Supprimer une entreprise
export const deleteEntreprise = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID de l'entreprise requis" });

    const entreprise = await Entreprise.findById(id);
    if (!entreprise) return res.status(404).json({ success: false, message: "Entreprise non trouvée" });

    if (entreprise.logo) {
      const logoPath = path.join('.', entreprise.logo);
      deleteFile(logoPath);
    }

    await Entreprise.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Entreprise supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
