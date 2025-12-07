import express from 'express';
import {
  createEntreprise,
  getAllEntreprises,
  getEntrepriseById,
  updateEntreprise,
  deleteEntreprise
} from '../controllers/entrepriseController.js';
import { uploadLogo } from '../config/multer.js'; // CORRECTION ICI

const router = express.Router();

// Middleware de gestion d'erreurs multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier est trop volumineux (max 5MB)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erreur lors de l'upload: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload du fichier'
    });
  }
  
  next();
};

// Routes avec upload d'image
router.post('/', uploadLogo.single('logo'), handleMulterError, createEntreprise);
router.get('/', getAllEntreprises);
router.get('/:id', getEntrepriseById);
router.put('/:id', uploadLogo.single('logo'), handleMulterError, updateEntreprise);
router.get('/:id', uploadLogo.single('logo'), handleMulterError, updateEntreprise);
router.delete('/:id', deleteEntreprise);
router.post('/:id', updateEntreprise);


export default router;