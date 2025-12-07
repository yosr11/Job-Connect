import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Admin from "../models/admin.js";

import Candidat  from "../models/candidat.js";
import  Recruteur from "../models/recruteur.js";
import bcrypt from "bcrypt";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outlook, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  try {
    let user;
    if (role === "admin") user = await Admin.findOne({ email });
    else if (role === "candidat") user = await Candidat.findOne({ email });
    else if (role === "recruteur") user = await Recruteur.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Générer token JWT valable 15 minutes
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;;

    await transporter.sendMail({
  from: `"JobConnect" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Réinitialisation de votre mot de passe",
  html: `
    <p>Bonjour ${user.nom || "Utilisateur"},</p>
    <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Le lien est valable 15 minutes.</p>
  `,
});

    res.json({ message: "Email envoyé avec succès ! Vérifiez votre boîte mail." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
  }
};

export const verifyToken = (req, res) => {
  const { token } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, id: payload.id, role: payload.role });
  } catch (error) {
    res.status(400).json({ valid: false, message: "Token invalide ou expiré" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = payload;

    let user;
    if (role === "admin") user = await Admin.findById(id);
    else if (role === "candidat") user = await Candidat.findById(id);
    else if (role === "recruteur") user = await Recruteur.findById(id);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.mot_de_passe = await bcrypt.hash(newPassword, 10);
    await user.save();// ⚠️ penser à hasher le mot de passe
    

    res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};
