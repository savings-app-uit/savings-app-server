const bcrypt = require("bcryptjs");
const { db } = require("../../../../config/firebase");

module.exports = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (userSnap.empty) return res.status(404).json({ message: "User not found" });

    const userDoc = userSnap.docs[0];
    const userId = userDoc.id;

    const otpSnap = await db.collection("password_otps")
      .where("userId", "==", userId)
      .where("isUsed", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (otpSnap.empty) return res.status(400).json({ message: "No valid OTP" });

    const otpDoc = otpSnap.docs[0];
    const otpData = otpDoc.data();

    if (otpData.otp !== code)
      return res.status(400).json({ message: "Invalid code" });

    const createdAt = otpData.createdAt.toDate();
    const now = new Date();

    if ((now - createdAt) / 1000 > 300)
      return res.status(400).json({ message: "Code expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection("users").doc(userId).update({ password: hashed });
    await db.collection("password_otps").doc(otpDoc.id).update({ isUsed: true });

    return res.json({ message: "Password reset successful" });

  } catch (err) {
    return res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};
