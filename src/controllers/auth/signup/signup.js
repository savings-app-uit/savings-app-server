const { db } = require("../../../config/firebase");
const { sendVerificationEmail } = require("../../../utils/mailer");

module.exports = async (req, res) => {
  const { email, name, phone, password } = req.body;

  if (!email || !name || !phone || !password)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (!userSnap.empty)
      return res.status(400).json({ message: "Email already registered" });

    const oldOtpSnap = await db.collection("password_otps")
      .where("email", "==", email)
      .where("type", "==", "signup")
      .get();
    const batch = db.batch();
    oldOtpSnap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await db.collection("password_otps").add({
      email,
      type: "signup",
      name,
      phone,
      password,
      otp,
      createdAt: new Date(),
      isUsed: false
    });

    await sendVerificationEmail(email, otp);
    return res.json({ message: "Verification code sent to email" });

  } catch (err) {
    return res.status(500).json({ message: "Failed to send code", error: err.message });
  }
};
