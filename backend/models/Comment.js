import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    formationId: { type: String, required: true }, // ID ou nom du module vidéo
    message: { type: String, required: true },
    reply: { type: String }, // Réponse de l'admin (optionnelle)
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
