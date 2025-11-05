import User from "../models/User.js";
import crypto from "crypto";

// Génère un code aléatoire
const generateCode = () => crypto.randomBytes(3).toString("hex").toUpperCase();

// Créer un client
export const createClient = async (req, res) => {
  try {
    const { name, country, phone } = req.body;
    // Génère automatiquement un code d'accès client
    const accessCode = generateCode();
    const client = new User({ name, country, phone, role: "client", accessCode });
    await client.save();

    res.status(201).json({ success: true, message: "Client créé avec succès", client });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Créer un admin (seulement au démarrage ou via super admin)
export const createAdmin = async (req, res) => {
  try {
    const { name, country, phone, password } = req.body;
    if (!password || password.length < 3) {
      return res.status(400).json({ success: false, message: "Le code/mot de passe admin est requis" });
    }
    // Créer l'admin sans accessCode (champ absent, pas null)
    // Utiliser create() avec un objet qui n'inclut pas accessCode
    const adminData = { name, country, phone, role: "admin", password, mustChangePassword: false };
    const admin = await User.create(adminData);
    // S'assurer que accessCode est supprimé après création
    await User.updateOne({ _id: admin._id }, { $unset: { accessCode: "" } });
    // Recharger pour obtenir l'admin sans accessCode
    const adminClean = await User.findById(admin._id).select("-password");
    return res.status(201).json({ success: true, message: "Admin créé avec succès", admin: adminClean });
  } catch (err) {
    // Si erreur d'unicité sur accessCode, nettoyer et réessayer
    if (err.code === 11000 && err.keyPattern?.accessCode) {
      try {
        // Nettoyer d'abord les accessCode null existants pour les admins
        await User.updateMany({ role: "admin", accessCode: null }, { $unset: { accessCode: "" } });
        // Recréer
        const adminData = { name, country, phone, role: "admin", password, mustChangePassword: false };
        const admin = await User.create(adminData);
        await User.updateOne({ _id: admin._id }, { $unset: { accessCode: "" } });
        const adminClean = await User.findById(admin._id).select("-password");
        return res.status(201).json({ success: true, message: "Admin créé avec succès", admin: adminClean });
      } catch (retryErr) {
        return res.status(500).json({ success: false, message: retryErr.message });
      }
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Réinitialiser le code client
export const resetClientCode = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "client") {
      return res.status(404).json({ success: false, message: "Client non trouvé" });
    }

    user.accessCode = generateCode();
    await user.save();

    res.json({ success: true, message: "Nouveau code généré", newCode: user.accessCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer tous les utilisateurs (admin uniquement)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer tous les clients (admin uniquement)
export const getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
