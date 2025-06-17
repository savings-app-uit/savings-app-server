const { db } = require("../../../config/firebase");
const { sendVerificationEmail } = require("../../../utils/mailer");

module.exports = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (!userSnap.empty)
      return res.status(400).json({ message: "Email already registered" });

    const old = await db.collection("password_otps")
      .where("email", "==", email)
      .where("type", "==", "signup")
      .get();
    const batch = db.batch();
    old.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await db.collection("password_otps").add({
      email,
      otp,
      type: "signup",
      createdAt: new Date(),
      isUsed: false
    });

    await sendVerificationEmail(email, otp);

    return res.json({ message: "Signup code sent successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Failed to send signup code", error: err.message });
  }
};