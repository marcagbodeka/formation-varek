import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Synchronisation des index...");
    const res = await User.syncIndexes();
    console.log("✅ Index synchronisés:", res);
    process.exit(0);
  } catch (e) {
    console.error("❌ Erreur syncIndexes:", e.message);
    process.exit(1);
  }
};

run();


