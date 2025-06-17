const { db } = require("../../../../config/firebase");
const { sendVerificationEmail } = require("../../../../utils/mailer");

module.exports = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty)
      return res.status(404).json({ message: "User not found" });

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await db.collection("password_otps").add({
      userId,
      otp,
      createdAt: new Date(),
      isUsed: false
    });

    await sendVerificationEmail(email, otp);

    return res.json({ message: "Verification code sent" });

  } catch (err) {
    return res.status(500).json({ message: "Failed to send code", error: err.message });
  }
};
