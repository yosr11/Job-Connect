import mongoose from "mongoose";

const candidatSchema = new mongoose.Schema(
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
  
     date_naissance: {
    type: Date,
    required: false, // facultatif, tu peux le rendre obligatoire si besoin
  },
  cv: {
    type: String, // stocke le chemin du fichier ou l’URL (ex : "uploads/cv.pdf")
    required: false,
  },
              
    cv_text: { type: String },         // texte extrait
    cv_embedding: { type: [Number] },  // tableau de nombres

  competences: {
    type: String, // texte libre (long)
    required: false,
  },
  adresse: {
    type: String,
    required: false,
    trim: true,
  },
  etat: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
 role: { type: String, enum: ["candidat", "recruteur", "admin"], required: true, default: "candidat" }


  },
  { timestamps: true }
);

const Candidat = mongoose.model("Candidat", candidatSchema);
export default Candidat;
