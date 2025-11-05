import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const checkAdmin = async () => {
  try {
    await connectDB();

    const admins = await User.find({ role: "admin" }).select("name phone country");

    if (admins.length === 0) {
      console.log("\n❌ Aucun administrateur trouvé dans la base de données\n");
      process.exit(0);
    }

    console.log("\n=== Administrateurs trouvés ===\n");
    
    admins.forEach((admin, index) => {
      console.log(`Admin ${index + 1}:`);
      console.log(`  Nom: ${admin.name}`);
      console.log(`  Pays: ${admin.country || "Non défini"}`);
      console.log(`  Numéro: ${admin.phone}`);
      console.log(`  \n  📝 Pour vous connecter:`);
      console.log(`     - Numéro: ${admin.phone}`);
      console.log(`     - Mot de passe: (celui défini lors de la création)\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  }
};

checkAdmin();


