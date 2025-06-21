exports.getCategories = async (req, res) => {
  const { type, userId } = req.query;

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const snapshot = await db.collection("categories")
      .where("type", "==", type)
      .where("userId", "in", [null, userId])
      .get();

    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};
