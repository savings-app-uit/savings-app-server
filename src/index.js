const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const { db } = require("./config/firebase");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);


app.get("/test", async (req, res) => {
  try {
    const snapshot = await db.collection("test").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
