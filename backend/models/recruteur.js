import mongoose from "mongoose";

const recruteurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Format d'email invalide"]
    },
    num_tel: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 8
    },
    mot_de_passe: {
      type: String,
      required: true,
    },
    confirmer_mot_de_passe: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "recruteur" ,
    },
    etat: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
role: { type: String, enum: ["candidat", "recruteur", "admin"], required: true },

    entreprise: { type: mongoose.Schema.Types.ObjectId, ref: "Entreprise" }
  },
  { timestamps: true }
);

const Recruteur = mongoose.model("Recruteur", recruteurSchema);
export default Recruteur;
