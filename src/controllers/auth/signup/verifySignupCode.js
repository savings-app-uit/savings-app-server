const { db } = require("../../../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ message: "Missing email or code" });

  try {
    const otpSnap = await db.collection("signup_otps")
      .where("email", "==", email)
      .where("isUsed", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (otpSnap.empty)
      return res.status(400).json({ message: "No valid code found" });

    const otpDoc = otpSnap.docs[0];
    const otpData = otpDoc.data();

    const createdAt = otpData.createdAt.toDate();
    const now = new Date();

    if ((now - createdAt) / 1000 > 300)
      return res.status(400).json({ message: "Code expired" });

    if (otpData.otp !== code)
      return res.status(400).json({ message: "Invalid code" });

    const hashedPassword = await bcrypt.hash(otpData.password, 10);

    const newUserRef = await db.collection("users").add({
      name: otpData.name,
      email: otpData.email,
      phone: otpData.phone,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    await db.collection("signup_otps").doc(otpDoc.id).update({ isUsed: true });

    const token = jwt.sign(
      { id: newUserRef.id, email, name: otpData.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUserRef.id,
        name: otpData.name,
        email: otpData.email,
        phone: otpData.phone
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
