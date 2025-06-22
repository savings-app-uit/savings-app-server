const { db } = require("../config/firebase");

exports.addCategory = async (req, res) => {
  const { name, iconId, type } = req.body;
  const userId = req.userId;

  if (!name || !iconId || !["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const iconDoc = await db.collection("icons").doc(iconId).get();
    if (!iconDoc.exists) {
      return res.status(400).json({ message: "Invalid iconId" });
    }

    const newCategory = {
      name,
      iconId,
      type,
      isDefault: false,
      userId
    };

    const docRef = await db.collection("categories").add(newCategory);

    res.status(201).json({ message: "Category created", id: docRef.id });
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};
exports.getCategories = async (req, res) => {
  const { type } = req.query;
  const userId = req.userId;

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const [defaultSnap, userSnap] = await Promise.all([
      db.collection("categories")
        .where("type", "==", type)
        .where("userId", "==", null)
        .get(),

      db.collection("categories")
        .where("type", "==", type)
        .where("userId", "==", userId)
        .get()
    ]);

    const categories = [...defaultSnap.docs, ...userSnap.docs].map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};



exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const docRef = db.collection("categories").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const data = doc.data();

    if (data.isDefault || data.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this category" });
    }

    await docRef.delete();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};