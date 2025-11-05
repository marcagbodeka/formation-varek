import Comprehension from "../models/Comprehension.js";

// Enregistrer une réponse de compréhension (oui/non)
export const saveAnswer = async (req, res) => {
  try {
    const { formationId, answer } = req.body;
    if (!formationId || !answer) {
      return res.status(400).json({ success: false, message: "formationId et answer requis" });
    }

    // Si déjà répondu, retourner la réponse existante
    const existing = await Comprehension.findOne({ user: req.user.id, formationId });
    if (existing) {
      return res.json({ success: true, answer: existing, alreadyAnswered: true });
    }

    const newAnswer = await Comprehension.create({ user: req.user.id, formationId, answer });
    res.status(201).json({ success: true, answer: newAnswer, alreadyAnswered: false });
  } catch (err) {
    // Gérer l'unicité (si race condition)
    if (err.code === 11000) {
      const existing = await Comprehension.findOne({ user: req.user.id, formationId: req.body.formationId });
      return res.json({ success: true, answer: existing, alreadyAnswered: true });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer la réponse de l'utilisateur connecté pour une formation
export const getMyAnswer = async (req, res) => {
  try {
    const { id } = req.params; // formationId
    const answer = await Comprehension.findOne({ user: req.user.id, formationId: id });
    res.json({ success: true, answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


