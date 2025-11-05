import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String }, // seulement pour les admins
    role: { type: String, enum: ["admin", "client"], default: "client" },
    // code client unique mais uniquement quand présent (clients)
    accessCode: { type: String, unique: true, sparse: true },
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash du mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
