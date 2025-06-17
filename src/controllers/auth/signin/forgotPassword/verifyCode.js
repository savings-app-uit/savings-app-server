const { db } = require("../../../../config/firebase");

module.exports = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Missing email or code" });

  try {
    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (userSnap.empty) return res.status(404).json({ message: "User not found" });

    const userId = userSnap.docs[0].id;

    const otpSnap = await db.collection("password_otps")
      .where("userId", "==", userId)
      .where("isUsed", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (otpSnap.empty)
      return res.status(400).json({ message: "No valid code found" });

    const otpData = otpSnap.docs[0].data();
    const createdAt = otpData.createdAt.toDate();
    const now = new Date();

    if ((now - createdAt) / 1000 > 300)
      return res.status(400).json({ message: "Code expired" });

    if (otpData.otp !== code)
      return res.status(400).json({ message: "Invalid code" });

    return res.json({ message: "Code verified" });

  } catch (err) {
    return res.status(500).json({ message: "Error verifying code", error: err.message });
  }
};
