const { db } = require("../config/firebase");

exports.addTransaction = async (req, res) => {
  try {
const { categoryId, amount, description, date, type } = req.body;
const userId = req.userId; 

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const docRef = await db.collection("transactions").add({
        userId,
        categoryId,
        amount,
        description,
        date: new Date(date || Date.now()),
        type
});


    res.status(201).json({ message: "Transaction added", id: docRef.id });
  } catch (err) {
    res.status(500).json({ message: "Error adding transaction", error: err });
  }
};
