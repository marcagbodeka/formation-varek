import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    console.log("1. Suppression de l'ancien index accessCode_1...");
    try {
      await User.collection.dropIndex("accessCode_1");
      console.log("   ✅ Index supprimé");
    } catch (idxErr) {
      if (idxErr.code === 27 || idxErr.codeName === "IndexNotFound") {
        console.log("   ℹ️  Index n'existe pas déjà");
      } else {
        console.log(`   ⚠️  Tentative de suppression: ${idxErr.message}`);
        // Essayer de lister tous les index et supprimer celui sur accessCode
        const indexes = await User.collection.indexes();
        for (const idx of indexes) {
          if (idx.key && idx.key.accessCode) {
            try {
              await User.collection.dropIndex(idx.name);
              console.log(`   ✅ Index ${idx.name} supprimé`);
            } catch (e) {
              console.log(`   ⚠️  Impossible de supprimer ${idx.name}`);
            }
          }
        }
      }
    }

    console.log("2. Nettoyage des accessCode null...");
    // Supprimer le champ accessCode pour tous les documents où il est null
    const res1 = await User.updateMany(
      { accessCode: null },
      { $unset: { accessCode: "" } }
    );
    console.log(`   ${res1.modifiedCount} documents nettoyés`);

    // Supprimer aussi pour les admins qui n'ont pas besoin d'accessCode
    const res2 = await User.updateMany(
      { role: "admin", accessCode: { $exists: true } },
      { $unset: { accessCode: "" } }
    );
    console.log(`   ${res2.modifiedCount} admins nettoyés`);

    console.log("3. Recréation de l'index avec sparse:true...");
    await User.collection.createIndex({ accessCode: 1 }, { unique: true, sparse: true });
    console.log("   ✅ Index recréé");

    console.log("4. Normalisation des codes existants (majuscules)...");
    const usersWithCodes = await User.find({ accessCode: { $exists: true, $ne: null } }).select("_id accessCode");
    let updated = 0;
    for (const u of usersWithCodes) {
      const upper = (u.accessCode || "").toUpperCase().trim();
      if (upper && upper !== u.accessCode) {
        await User.updateOne({ _id: u._id }, { $set: { accessCode: upper } });
        updated += 1;
      }
    }
    console.log(`   ${updated} codes normalisés`);

    console.log("\n✅ Nettoyage terminé !");
    process.exit(0);
  } catch (e) {
    console.error("\n❌ Erreur:", e.message);
    process.exit(1);
  }
};

run();


