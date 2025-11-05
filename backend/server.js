import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import formationRoutes from "./routes/formationRoutes.js";
import comprehensionRoutes from "./routes/comprehensionRoutes.js";


// Charger les variables d’environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // Autoriser toutes les origines (à restreindre en production)
  credentials: true,
}));
app.use(express.json());

// Servir les fichiers statiques (vidéos, images)
app.use("/uploads", express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/formations", formationRoutes);
app.use("/api/comprehension", comprehensionRoutes);



// Route de test principale
app.get("/", (req, res) => {
  res.send("✅ Backend Formation Varek opérationnel 🚀");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Écouter sur toutes les interfaces réseau

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur en cours sur http://localhost:${PORT}`);
  console.log(`🌐 Accessible depuis le réseau sur http://0.0.0.0:${PORT}`);
  console.log(`💡 Utilisez l'IP de cette machine pour accéder depuis d'autres appareils`);
});

