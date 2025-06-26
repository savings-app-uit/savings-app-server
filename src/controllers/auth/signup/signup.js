const bcrypt = require("bcryptjs");
const { db } = require("../../../config/firebase");
const jwt = require("jsonwebtoken"); 

module.exports = async (req, res) => {
  const { name, phone, password, email, code } = req.body;
  if (!name || !phone || !password || !email || !code)
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
    const userRef = await db.collection("users").add({
      name,
      email,
      phone,
      password: hashed,
      createdAt: new Date()
    });

    await db.collection("password_otps").doc(otpDoc.id).update({ isUsed: true });

    const token = jwt.sign({ userId: userRef.id }, "your_jwt_secret", { expiresIn: "7d" });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: userRef.id,
        email,
        name
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};
