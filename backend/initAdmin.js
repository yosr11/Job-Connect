import bcrypt from "bcryptjs";
import Admin from "./models/admin.js";

export async function initializeDefaultAdmin() {
  const existing = await Admin.findOne({ role: "admin" });
  if (existing) return; // already present, do nothing

  const defaultNom = process.env.ADMIN_NOM || "Super";
  const defaultPrenom = process.env.ADMIN_PRENOM || "Admin";
  const defaultEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const defaultPhone = process.env.ADMIN_TEL || "12345678";
  const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(defaultPassword, salt);

  const admin = await Admin.create({
    nom: defaultNom,
    prenom: defaultPrenom,
    email: defaultEmail,
    num_tel: defaultPhone,
    mot_de_passe: hashed,
    role: "admin",
  });

  // eslint-disable-next-line no-console
  console.log(`Admin par défaut créé : ${admin.email}`);
}


