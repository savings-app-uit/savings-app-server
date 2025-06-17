const bcrypt = require("bcryptjs");
const { db } = require("../../../config/firebase");

module.exports = async (req, res) => {
  const { username, phone, password, email, code } = req.body;
  if (!username || !phone || !password || !email || !code)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const otpSnap = await db.collection("password_otps")
      .where("email", "==", email)
      .where("type", "==", "signup")
      .where("isUsed", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (otpSnap.empty)
      return res.status(400).json({ message: "Please verify your email before signing up" });

    const otpDoc = otpSnap.docs[0];
    const otpData = otpDoc.data();

    const createdAt = otpData.createdAt.toDate();
    const now = new Date();
    if ((now - createdAt) / 1000 > 300)
      return res.status(400).json({ message: "Verification expired" });

    if (otpData.otp !== code)
      return res.status(400).json({ message: "Invalid code" });

    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (!userSnap.empty)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await db.collection("users").add({
      username,
      email,
      phone,
      password: hashed,
      createdAt: new Date()
    });

    await db.collection("password_otps").doc(otpDoc.id).update({ isUsed: true });

    return res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};