import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByFormation,
  replyToComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Ajouter un commentaire (client)
router.post("/", protect, addComment);

// Récupérer les commentaires d'une formation
router.get("/:id", protect, getCommentsByFormation);

// Répondre à un commentaire (admin)
router.put("/:id/reply", protect, adminOnly, replyToComment);

export default router;
