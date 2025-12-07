import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "admin" ,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
