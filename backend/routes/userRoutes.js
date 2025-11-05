import express from "express";
import { createAdmin, createClient, resetClientCode, getAllClients, getAllUsers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Créer un admin (optionnel)
router.post("/admin", createAdmin);

// Récupérer tous les clients (admin uniquement)
router.get("/", protect, adminOnly, getAllClients);

// Récupérer tous les utilisateurs (admin uniquement)
router.get("/all", protect, adminOnly, getAllUsers);

// Créer un client
router.post("/client", protect, adminOnly, createClient);

// Reset du code client
router.put("/client/:id/reset", protect, adminOnly, resetClientCode);

export default router;
