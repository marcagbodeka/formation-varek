import express from "express";
import { adminLogin, clientLogin } from "../controllers/authController.js";

const router = express.Router();

// Connexion admin (numéro + mot de passe)
router.post("/admin/login", adminLogin);

// Connexion client (code unique)
router.post("/client/login", clientLogin);


export default router;
