import Recruteur from "../models/recruteur.js";
import Entreprise from "../models/entreprise.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Helper pour supprimer un fichier
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const loginRecruteur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // 🔍 Chercher le recruteur SANS populate d'abord pour voir la donnée brute
    const recruteur = await Recruteur.findOne({ email });

    console.log("📧 Recruteur trouvé:", recruteur?.email);
    console.log("🏢 Entreprise (brute):", recruteur?.entreprise);

    if (!recruteur) {
      return res.status(404).json({ message: "Recruteur non trouvé" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, recruteur.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // ⚡ Récupérer directement l'entrepriseId (c'est déjà un ObjectId)
    const entrepriseId = recruteur.entreprise ? recruteur.entreprise.toString() : null;

    console.log("🆔 EntrepriseId extrait:", entrepriseId);

    // ⚡ Créer le token
    const token = jwt.sign(
      { 
        id: recruteur._id.toString(),
        email: recruteur.email,
        role: recruteur.role,
        entrepriseId
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1h" }
    );

    // ⚡ Envoyer la réponse avec entrepriseId
    res.status(200).json({
      message: "Connexion réussie",
      token,
      recruteur: {
        _id: recruteur._id.toString(),
        nom: recruteur.nom,
        prenom: recruteur.prenom,
        email: recruteur.email,
        num_tel: recruteur.num_tel,
        role: recruteur.role,
        entrepriseId  // ✅ Maintenant il sera présent
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors du login recruteur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



// REGISTER
export const registerRecruteur = async (req, res) => {
  try {
    const { nom, prenom, email, num_tel, mot_de_passe, confirmer_mot_de_passe, entreprise_id } = req.body;

    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe || !entreprise_id) {
      return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis" });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Format d'email invalide" });
    if (!/^\d{8}$/.test(num_tel)) return res.status(400).json({ success: false, message: "Le numéro de téléphone doit contenir exactement 8 chiffres" });
    if (mot_de_passe.length < 6) return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères" });
    if (mot_de_passe !== confirmer_mot_de_passe) return res.status(400).json({ success: false, message: "Les mots de passe ne correspondent pas" });

    const existing = await Recruteur.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Un compte avec cet email existe déjà" });

    const entreprise = await Entreprise.findById(entreprise_id);
    if (!entreprise) return res.status(400).json({ success: false, message: "Entreprise non trouvée" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    const recruteur = await Recruteur.create({
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe: hashedPassword,
      confirmer_mot_de_passe: hashedPassword,
      entreprise: entreprise_id,
    });

    const token = jwt.sign(
      { id: recruteur._id, role: recruteur.role, email: recruteur.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: {
        id: recruteur._id,
        nom: recruteur.nom,
        prenom: recruteur.prenom,
        email: recruteur.email,
        num_tel: recruteur.num_tel,
        role: recruteur.role,
        entreprise: {
          id: entreprise._id,
          nom: entreprise.nom,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de la création du compte", error: error.message });
  }
};

// UPDATE Profil recruteur
export const updateRecruteur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, num_tel, mot_de_passe } = req.body;

    const recruteur = await Recruteur.findById(id);
    if (!recruteur) return res.status(404).json({ message: "Recruteur non trouvé" });

    if (nom) recruteur.nom = nom;
    if (prenom) recruteur.prenom = prenom;
    if (email) recruteur.email = email;
    if (num_tel) recruteur.num_tel = num_tel;

    if (mot_de_passe) {
      if (mot_de_passe.length < 6) return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
      const salt = await bcrypt.genSalt(10);
      recruteur.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);
    }

    const updatedRecruteur = await recruteur.save();
    res.status(200).json({
      message: "Profil mis à jour avec succès",
      recruteur: {
        id: updatedRecruteur._id,
        nom: updatedRecruteur.nom,
        prenom: updatedRecruteur.prenom,
        email: updatedRecruteur.email,
        num_tel: updatedRecruteur.num_tel,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET Profil recruteur
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const recruteur = await Recruteur.findById(id).populate("entreprise", "nom description logo email num_tel");

    if (!recruteur) return res.status(404).json({ message: "Recruteur non trouvé" });

    res.status(200).json({
      id: recruteur._id,
      nom: recruteur.nom,
      prenom: recruteur.prenom,
      email: recruteur.email,
      num_tel: recruteur.num_tel,
      role: recruteur.role,
      entreprise: recruteur.entreprise,
      createdAt: recruteur.createdAt,
      updatedAt: recruteur.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET entreprise du recruteur
export const getEntrepriseByRecruteur = async (req, res) => {
  try {
    const { id } = req.params;
    const recruteur = await Recruteur.findById(id).populate("entreprise");

    if (!recruteur) return res.status(404).json({ message: "Recruteur non trouvé" });
    if (!recruteur.entreprise) return res.status(404).json({ message: "Aucune entreprise associée à ce recruteur" });

    res.status(200).json({
      success: true,
      message: "Entreprise du recruteur récupérée avec succès",
      entreprise: {
        id: recruteur.entreprise._id,
        nom: recruteur.entreprise.nom,
        adresse: recruteur.entreprise.adresse,
        secteur: recruteur.entreprise.secteur,
        site_web: recruteur.entreprise.site_web,
        description: recruteur.entreprise.description,
        logo: recruteur.entreprise.logo,
        email: recruteur.entreprise.email,
        num_tel: recruteur.entreprise.num_tel,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise du recruteur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// UPDATE entreprise du recruteur
export const updateEntrepriseByRecruteur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, secteur, site_web, description, email, num_tel } = req.body;

    const recruteur = await Recruteur.findById(id).populate("entreprise");
    if (!recruteur) return res.status(404).json({ message: "Recruteur non trouvé" });
    if (!recruteur.entreprise) return res.status(404).json({ message: "Aucune entreprise associée" });

    const entreprise = await Entreprise.findById(recruteur.entreprise._id);

    if (nom) entreprise.nom = nom;
    if (adresse) entreprise.adresse = adresse;
    if (secteur) entreprise.secteur = secteur;
    if (site_web) entreprise.site_web = site_web;
    if (description) entreprise.description = description;
    if (email) entreprise.email = email;
    if (num_tel) entreprise.num_tel = num_tel;

    if (req.file) {
      if (entreprise.logo) deleteFile(path.join('.', entreprise.logo));
      entreprise.logo = `/uploads/logos/${req.file.filename}`;
    }

    await entreprise.save();
    res.status(200).json({ success: true, message: "Entreprise mise à jour avec succès", entreprise });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise :", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
