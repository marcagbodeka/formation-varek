import Comment from "../models/Comment.js";

// Ajouter un commentaire
export const addComment = async (req, res) => {
  try {
    const { formationId, message } = req.body;
    const newComment = await Comment.create({
      user: req.user.id,
      formationId,
      message,
    });
    res.json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer tous les commentaires d'une vidéo
export const getCommentsByFormation = async (req, res) => {
  try {
    const comments = await Comment.find({ formationId: req.params.id })
      .populate("user", "name country role")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Répondre à un commentaire (admin uniquement)
export const replyToComment = async (req, res) => {
  try {
    const { reply } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
