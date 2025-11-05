import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveAnswer, getMyAnswer } from "../controllers/comprehensionController.js";

const router = express.Router();

// Enregistrer une réponse (client connecté)
router.post("/", protect, saveAnswer);
router.get("/:id", protect, getMyAnswer);

export default router;


