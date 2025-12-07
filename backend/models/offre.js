import mongoose from "mongoose";

const offreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    niveau: {
      type: String,
      required: true,
       // tu peux adapter les options
    },
    nom_entreprise: {
      type: String,
      required: true,
      trim: true,
    },
    entrepriseId: { type: mongoose.Schema.Types.ObjectId, ref: "Entreprise", required: true },
    date_debut: {
      type: Date,
      required: true,
    },
    recruteur: { type: mongoose.Schema.Types.ObjectId, ref: "Recruteur" },
   //etat: { type: String, enum: ["pending", "active", "rejected", "expired"], default: "pending" },
    date_limite: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // vérifie que la date limite est postérieure à la date de début
          return this.date_debut ? value >= this.date_debut : true;
        },
        message: "La date limite doit être postérieure à la date de début",
      },
    },
     // ⭐ AJOUT IMPORTANT
    embedding: {
      type: [Number],   // vecteur embedding généré par Python ML
      default: [],
    },
  },
  { timestamps: true } // ajoute automatiquement createdAt et updatedAt
);

const Offre = mongoose.model("Offre", offreSchema);
export default Offre;
