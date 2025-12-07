import express from "express";
import { loginRecruteur, registerRecruteur , updateRecruteur , getProfile , getEntrepriseByRecruteur ,
    updateEntrepriseByRecruteur
} from "../controllers/recruteurController.js";
import { uploadLogo } from '../config/multer.js';

  
const router = express.Router();


router.post("/login", loginRecruteur);
router.post("/register", registerRecruteur);
router.put("/:id", updateRecruteur);
router.get("/:id", getProfile);

router.get("/entreprise/:id", getEntrepriseByRecruteur);

router.put("/entreprise/:id", uploadLogo.single("logo"), updateEntrepriseByRecruteur);


export default router;
