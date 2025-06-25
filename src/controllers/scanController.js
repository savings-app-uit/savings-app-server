const { db } = require("../config/firebase");
const { executePythonScript } = require("../utils/pythonExecutor");
const path = require("path");
const fs = require("fs");

exports.scanImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    console.log(`Processing image for user ${req.userId}: ${imagePath}`);
    const classificationResult = await executePythonScript(imagePath);

    if (!classificationResult.success) {
      console.error("Classification failed:", classificationResult.error);
      return res.status(400).json({ error: classificationResult.error });
    }

    const categoryName = classificationResult.category;
    const categorySnapshot = await db
      .collection("categories")
      .where("name", "==", categoryName)
      .where("isDefault", "==", true)
      .get();

    let categoryData = null;
    if (!categorySnapshot.empty) {
      const doc = categorySnapshot.docs[0];
      const data = doc.data();
      const iconSnap = await db.collection("icons").doc(data.iconId).get();
      const iconData = iconSnap.exists ? iconSnap.data() : null;

      categoryData = {
        id: doc.id,
        name: data.name,
        iconId: data.iconId,
        type: data.type,
        isDefault: data.isDefault,
        userId: data.userId,
        icon: iconData
          ? { icon: iconData.icon || null, color: iconData.color || null }
          : null,
      };
    } else {
      categoryData = { name: categoryName };
    }

    const response = {
      category: categoryData,
      date: classificationResult.invoice_date,
      amount: classificationResult.total_amount,
    };

    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.json(response);
  } catch (error) {
    console.error("Scan error details:", error);
    res.status(500).json({ error: "Server error during image processing" });
  }
};