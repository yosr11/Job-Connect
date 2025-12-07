import jwt from "jsonwebtoken";
import Recruteur from "../models/recruteur.js";
import Admin from "../models/admin.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès non autorisé : token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    // 🔍 AJOUTEZ CES LOGS POUR DÉBOGUER
    console.log("🔍 Token décodé:", decoded);
    console.log("🔍 Role:", decoded.role);

    req.user = decoded; // stocke les infos du user (id, email, role, etc.)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
// 🔥 Vérifier si l'utilisateur est ADMIN
export const isAdmin = async (req, res, next) => {
  try {
    console.log("🔍 Vérification admin - req.user:", req.user);
    console.log("🔍 Role reçu:", req.user?.role);
    
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Accès refusé. Admin uniquement.",
        receivedRole: req.user?.role // Pour voir ce qui est reçu
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
export default authMiddleware;
