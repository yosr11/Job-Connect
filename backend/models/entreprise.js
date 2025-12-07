import mongoose from "mongoose";

const entrepriseSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 100 },
    adresse: { type: String, trim: true, maxlength: 200 },
    secteur: { type: String, trim: true, maxlength: 50 },
    site_web: { 
      type: String, 
      trim: true, 
      validate: {
        validator: function(v) { return !v || /^https?:\/\/.+/.test(v); },
        message: "Format d'URL invalide (doit commencer par http:// ou https://)"
      }
    },
    description: { type: String, trim: true, maxlength: 500 },
    logo: { type: String, trim: true, default: null },

    // ⚡ Nouveaux champs
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function(v) { return !v || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); },
        message: "Format d'email invalide"
      }
    },
    num_tel: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) { return !v || /^\d{8,15}$/.test(v); },
        message: "Numéro de téléphone invalide (8 à 15 chiffres)"
      }
    },

    date_creation: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

// ⚡ Exporter le modèle par défaut
const Entreprise = mongoose.model("Entreprise", entrepriseSchema);
export default Entreprise;
