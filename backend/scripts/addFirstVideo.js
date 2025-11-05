import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Formation from "../models/Formation.js";

dotenv.config();

const addFirstVideo = async () => {
  try {
    await connectDB();

    console.log("\n=== Ajout de la première vidéo ===\n");

    // Vérifier si une formation existe déjà avec ce titre
    const existing = await Formation.findOne({ title: { $regex: /Module 1.*Introduction/i } });
    
    if (existing) {
      // Mettre à jour l'URL de la vidéo existante
      existing.videoUrl = "https://youtu.be/BgEzCs15nO4";
      existing.description = "Apprenez les bases fondamentales de la négociation efficace.";
      existing.duration = null; // YouTube gère la durée automatiquement
      existing.module = 1;
      existing.order = 1;
      existing.isActive = true;
      await existing.save();
      
      console.log(`✅ Formation existante mise à jour avec la nouvelle vidéo YouTube`);
      console.log(`   Titre: ${existing.title}`);
      console.log(`   URL: ${existing.videoUrl}`);
      console.log(`   ID: ${existing._id}\n`);
      process.exit(0);
    }

    // Créer une nouvelle formation
    const formation = new Formation({
      title: "Module 1 : Introduction à la Négociation",
      description: "Apprenez les bases fondamentales de la négociation efficace.",
      videoUrl: "https://youtu.be/BgEzCs15nO4",
      thumbnailUrl: "https://img.youtube.com/vi/BgEzCs15nO4/maxresdefault.jpg", // Thumbnail YouTube automatique
      duration: null, // YouTube gère la durée
      module: 1,
      order: 1,
      isActive: true,
    });

    await formation.save();

    console.log("✅ Formation créée avec succès!");
    console.log("\n📹 Détails de la formation:");
    console.log(`   Titre: ${formation.title}`);
    console.log(`   URL YouTube: ${formation.videoUrl}`);
    console.log(`   ID: ${formation._id}`);
    console.log(`   Module: ${formation.module}`);
    console.log("\n💡 Pour visualiser:");
    console.log("   1. Connectez-vous en tant que client");
    console.log("   2. Allez sur /formations");
    console.log("   3. Cliquez sur la formation pour voir la vidéo");
    console.log("\n");

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error("\n❌ Erreur: Une formation avec ces informations existe déjà");
    } else {
      console.error("\n❌ Erreur:", error.message);
    }
    process.exit(1);
  }
};

addFirstVideo();

