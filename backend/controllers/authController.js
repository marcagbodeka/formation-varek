import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Connexion ADMIN (numéro + mot de passe)
export const adminLogin = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Nettoyer le numéro de téléphone (enlever espaces, +, etc.)
    const cleanPhone = phone ? phone.trim().replace(/[+\s-]/g, "") : "";

    if (!cleanPhone || !password) {
      return res.status(400).json({ success: false, message: "Numéro et mot de passe requis" });
    }

    // Chercher l'admin par numéro exact ou sans code pays
    let admin = await User.findOne({ phone: cleanPhone, role: "admin" });
    
    // Si non trouvé, essayer de chercher sans le préfixe du pays (si numéro commence par 228, 225, etc.)
    if (!admin && cleanPhone.length > 8) {
      const phoneWithoutPrefix = cleanPhone.replace(/^(228|225|229|226|227)/, "");
      admin = await User.findOne({ phone: phoneWithoutPrefix, role: "admin" });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin introuvable" });
    }

    // Exiger un mot de passe et vérifier
    if (!admin.password) {
      return res.status(401).json({ success: false, message: "Mot de passe non configuré pour cet administrateur" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: admin._id, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "Connexion admin réussie", token, user: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Définir le mot de passe pour un admin connecté (première connexion)
export const setAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Mot de passe trop court (min 6)" });
    }
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Non autorisé" });
    }
    admin.password = newPassword; // hashé via pre('save')
    admin.mustChangePassword = false;
    admin.accessCode = undefined; // invalider le code temporaire
    await admin.save();
    res.json({ success: true, message: "Mot de passe défini avec succès" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Connexion CLIENT (code unique)
export const clientLogin = async (req, res) => {
  const { accessCode } = req.body;

  try {
    // Normaliser le code: trim + uppercase pour éviter les erreurs de casse/espaces
    const code = (accessCode || "").trim().toUpperCase();
    if (!code) return res.status(400).json({ success: false, message: "Code requis" });

    const user = await User.findOne({ accessCode: code, role: "client" });
    if (!user) return res.status(401).json({ success: false, message: "Code invalide" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "Connexion client réussie", token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
