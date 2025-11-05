import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    await connectDB();

    console.log("\n=== Création d'un administrateur ===\n");

    const name = await question("Nom complet: ");
    const country = await question("Pays (code, ex: TG): ");
    const phone = await question("Numéro de téléphone: ");
    const password = await question("Mot de passe: ");

    const admin = new User({
      name,
      country,
      phone,
      password,
      role: "admin",
    });

    await admin.save();

    console.log("\n✅ Administrateur créé avec succès!");
    console.log(`   Nom: ${admin.name}`);
    console.log(`   Téléphone: ${admin.phone}`);
    console.log(`   Rôle: ${admin.role}`);
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  }
};

createAdmin();


