const { db } = require("../../config/firebase");

exports.getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const doc = await db.collection("users").doc(userId).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });

    const data = doc.data();
    return res.json({
      id: doc.id,
      email: data.email,
      name: data.name || data.username,
      phone: data.phone || "",
      createdAt: data.createdAt || null
    });
  } catch (err) {
    return res.status(500).json({ message: "Error getting profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, phone } = req.body;

  try {
    await db.collection("users").doc(userId).update({
      ...(name && { name }),
      ...(phone && { phone })
    });

    return res.json({ message: "Profile updated" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  const userId = req.userId;

  try {
    await db.collection("users").doc(userId).delete();
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};
