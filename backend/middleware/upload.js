import multer from "multer";
import path from "path";

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/lettres_motivation/"); // Dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `LM-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtrage des fichiers (accepter seulement PDF et DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF et DOCX sont autorisés"));
  }
};

// Export du middleware
export const uploadLettreMotivation = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
}).single("lettre_motivation"); // Nom du champ dans le formulaire

const storageCv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `CV-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilterCv = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error("Seuls les fichiers PDF/DOC/DOCX sont autorisés"));
};

export const uploadCv = multer({
  storage: storageCv,
  fileFilter: fileFilterCv,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("cv");