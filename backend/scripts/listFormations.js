import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Formation from "../models/Formation.js";

dotenv.config();

const listFormations = async () => {
  try {
    await connectDB();

    const formations = await Formation.find({ isActive: true }).sort({ module: 1, order: 1 });

    if (formations.length === 0) {
      console.log("\n❌ Aucune formation trouvée\n");
      process.exit(0);
    }

    console.log("\n=== Formations disponibles ===\n");
    
    formations.forEach((formation, index) => {
      console.log(`Formation ${index + 1}:`);
      console.log(`  ID: ${formation._id}`);
      console.log(`  Titre: ${formation.title}`);
      console.log(`  Module: ${formation.module}`);
      console.log(`  URL Vidéo: ${formation.videoUrl}`);
      console.log(`  Durée: ${formation.duration ? `${Math.floor(formation.duration / 60)}:${(formation.duration % 60).toString().padStart(2, '0')}` : 'Non définie'}`);
      console.log("");
    });

    console.log(`\nTotal: ${formations.length} formation(s)\n`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  }
};

listFormations();


