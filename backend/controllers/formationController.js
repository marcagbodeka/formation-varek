import Formation from "../models/Formation.js";

// Récupérer toutes les formations
export const getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ isActive: true })
      .sort({ createdAt: 1, module: 1, order: 1 });
    res.json({ success: true, formations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer une formation par ID
export const getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ success: false, message: "Formation non trouvée" });
    }
    res.json({ success: true, formation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Créer une formation (admin uniquement)
export const createFormation = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration, module, order } = req.body;
    const formation = new Formation({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      module,
      order,
    });
    await formation.save();
    res.status(201).json({ success: true, formation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mettre à jour une formation (admin uniquement)
export const updateFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!formation) {
      return res.status(404).json({ success: false, message: "Formation non trouvée" });
    }
    res.json({ success: true, formation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Supprimer une formation (admin uniquement)
export const deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!formation) {
      return res.status(404).json({ success: false, message: "Formation non trouvée" });
    }
    res.json({ success: true, message: "Formation supprimée" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

