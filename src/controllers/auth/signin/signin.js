const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../../config/firebase");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty)
      return res.status(400).json({ message: "Email does not exist" });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: userDoc.id, email: userData.email, name: userData.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Signin successful",
      token,
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.name
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
