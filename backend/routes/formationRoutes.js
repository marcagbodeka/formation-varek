import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllFormations,
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation,
} from "../controllers/formationController.js";

const router = express.Router();

// Routes publiques (protégées par token)
router.get("/", protect, getAllFormations);
router.get("/:id", protect, getFormationById);

// Routes admin
router.post("/", protect, adminOnly, createFormation);
router.put("/:id", protect, adminOnly, updateFormation);
router.delete("/:id", protect, adminOnly, deleteFormation);

export default router;

