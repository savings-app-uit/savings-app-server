const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../config/firebase");

module.exports = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = await db.collection("users").add({
      name,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign(
      { id: newUserRef.id, email, name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUserRef.id,
        name,
        email,
        phone
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
