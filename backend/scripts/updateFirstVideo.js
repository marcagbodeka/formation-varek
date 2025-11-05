import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Formation from "../models/Formation.js";

dotenv.config();

const updateFirstVideo = async () => {
  try {
    await connectDB();

    console.log("\n=== Mise à jour de la vidéo ===\n");

    // Chercher la formation par l'URL YouTube
    const formation = await Formation.findOne({ 
      videoUrl: "https://youtu.be/BgEzCs15nO4" 
    });
    
    if (!formation) {
      console.log("❌ Formation non trouvée avec cette URL");
      console.log("💡 Création d'une nouvelle formation...\n");
      
      // Créer une nouvelle formation
      const newFormation = new Formation({
        title: "Ici commence ton parcours vers l'indépendance financière",
        description: "Cette vidéo présente de manière globale comment on fonctionne avec cette application.",
        videoUrl: "https://youtu.be/BgEzCs15nO4",
        thumbnailUrl: "https://img.youtube.com/vi/BgEzCs15nO4/maxresdefault.jpg",
        duration: null,
        module: 1,
        order: 1,
        isActive: true,
      });

      await newFormation.save();
      
      console.log("✅ Nouvelle formation créée avec succès!");
      console.log(`   Titre: ${newFormation.title}`);
      console.log(`   ID: ${newFormation._id}\n`);
      process.exit(0);
    }

    // Mettre à jour la formation existante
    formation.title = "Ici commence ton parcours vers l'indépendance financière";
    formation.description = "Cette vidéo présente de manière globale comment on fonctionne avec cette application.";
    await formation.save();

    console.log("✅ Formation mise à jour avec succès!");
    console.log("\n📹 Détails mis à jour:");
    console.log(`   Titre: ${formation.title}`);
    console.log(`   Description: ${formation.description}`);
    console.log(`   URL: ${formation.videoUrl}`);
    console.log(`   ID: ${formation._id}`);
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  }
};

updateFirstVideo();

