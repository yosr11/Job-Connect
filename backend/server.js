import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import candidatRoutes from "./routes/candidatRoutes.js";
import recruteurRoutes from "./routes/recruteurRoutes.js";
import entrepriseRoutes from "./routes/entrepriseRoutes.js";
import candidatureRoutes from "./routes/candidatureRoutes.js";
import { initializeDefaultAdmin } from "./initAdmin.js";
import authRoutes from "./routes/authRoutes.js";
import offresRoutes from "./routes/offreRoutes.js";
import path from "path";
import mlRoutes from "./routes/mlRoutes.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Charger .env depuis le dossier parent (racine)
dotenv.config({ path: path.join(__dirname, '..', '.env') });
console.log("🔍 MONGO_URI =", process.env.MONGO_URI);
console.log("🔍 JWT_SECRET =", process.env.JWT_SECRET);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connexion MongoDB
connectDB();
initializeDefaultAdmin().catch((e) => console.error(e));
// Définir le dossier uploads comme statique
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Exemple : route de test
app.get('/', (req, res) => {
  res.send('Serveur OK');
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/candidat", candidatRoutes);
app.use("/api/recruteur", recruteurRoutes);
app.use("/api/entreprises", entrepriseRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/offres", offresRoutes);
app.use("/api/candidatures", candidatureRoutes);
app.use("/api", mlRoutes); 
app.get("/", (req, res) => res.send("API Recrutement intelligente fonctionne !"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
