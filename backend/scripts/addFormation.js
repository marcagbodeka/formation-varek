import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Formation from "../models/Formation.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Exemples de formations - MODIFIEZ SELON VOS BESOINS
const formations = [
  {
    title: "Module 1 : Introduction à la Négociation",
    description: "Apprenez les bases fondamentales de la négociation efficace.",
    videoUrl: "https://example.com/video1.mp4", // Remplacez par l'URL de votre vidéo
    thumbnailUrl: "https://example.com/thumb1.jpg", // Optionnel
    duration: 450, // en secondes (7 minutes 30)
    module: 1,
    order: 1,
  },
  {
    title: "Module 2 : Techniques de Vente Avancées",
    description: "Maîtrisez les techniques de vente pour conclure plus de marchés.",
    videoUrl: "https://example.com/video2.mp4",
    thumbnailUrl: "https://example.com/thumb2.jpg",
    duration: 600, // 10 minutes
    module: 2,
    order: 2,
  },
  {
    title: "Module 3 : L'Art de la Prise de Parole",
    description: "Développez votre charisme et votre impact en public.",
    videoUrl: "https://example.com/video3.mp4",
    thumbnailUrl: "https://example.com/thumb3.jpg",
    duration: 720, // 12 minutes
    module: 3,
    order: 3,
  },
];

const addFormations = async () => {
  try {
    await connectDB();

    console.log("\n=== Ajout des formations ===\n");

    for (const formationData of formations) {
      // Vérifier si la formation existe déjà
      const existing = await Formation.findOne({ title: formationData.title });
      
      if (existing) {
        console.log(`⚠️  Formation "${formationData.title}" existe déjà, ignorée`);
        continue;
      }

      const formation = new Formation(formationData);
      await formation.save();
      
      console.log(`✅ Formation créée: ${formation.title}`);
    }

    console.log("\n✅ Toutes les formations ont été ajoutées avec succès!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  }
};

addFormations();


