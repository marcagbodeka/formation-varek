import mongoose from "mongoose";

const comprehensionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    formationId: { type: String, required: true },
    answer: { type: String, enum: ["yes", "no"], required: true },
  },
  { timestamps: true }
);

// Empêcher les doublons pour (user, formationId)
comprehensionSchema.index({ user: 1, formationId: 1 }, { unique: true });

export default mongoose.model("Comprehension", comprehensionSchema);


