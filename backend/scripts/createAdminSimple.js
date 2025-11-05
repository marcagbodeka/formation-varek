import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

// Paramètres par défaut - MODIFIEZ-LES selon vos besoins
const defaultAdmin = {
  name: "Administrateur",
  country: "TG",
  phone: "22890000001",  // Changez ce numéro (doit être unique)
  password: "admin123",   // Changez ce mot de passe
};

const createAdmin = async () => {
  try {
    await connectDB();

    console.log("\n=== Création d'un administrateur ===\n");

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Un administrateur existe déjà:");
      console.log(`   Nom: ${existingAdmin.name}`);
      console.log(`   Téléphone: ${existingAdmin.phone}`);
      console.log("\n💡 Pour vous connecter:");
      console.log(`   - Numéro: ${existingAdmin.phone}`);
      console.log("   - Mot de passe: (celui défini lors de la création)");
      process.exit(0);
    }

    // Créer l'admin
    const admin = new User({
      name: defaultAdmin.name,
      country: defaultAdmin.country,
      phone: defaultAdmin.phone,
      password: defaultAdmin.password,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Administrateur créé avec succès!");
    console.log("\n📝 Identifiants de connexion:");
    console.log(`   Pays: ${defaultAdmin.country}`);
    console.log(`   Numéro: ${defaultAdmin.phone}`);
    console.log(`   Mot de passe: ${defaultAdmin.password}`);
    console.log("\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!");
    console.log("\n");

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error("\n❌ Erreur: Un utilisateur avec ce numéro existe déjà");
      console.error("💡 Modifiez le numéro dans le script ou supprimez l'utilisateur existant");
    } else {
      console.error("\n❌ Erreur:", error.message);
    }
    process.exit(1);
  }
};

createAdmin();
