const bcrypt = require("bcryptjs");
const { db } = require("../config/firebase");

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
      imageUrl: data.imageUrl || "", 
      createdAt: data.createdAt || null
    });
  } catch (err) {
    return res.status(500).json({ message: "Error getting profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, phone, imageUrl } = req.body;

  try {
    await db.collection("users").doc(userId).update({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(imageUrl !== undefined && { imageUrl }) 
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

exports.changePassword = async (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing old or new password" });
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(oldPassword, userData.password);

    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection("users").doc(userId).update({ password: hashed });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error changing password", error: err.message });
  }
};