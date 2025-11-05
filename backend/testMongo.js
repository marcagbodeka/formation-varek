import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connexion MongoDB réussie !");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err);
  });
