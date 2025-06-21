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

exports.getTransactions = async (req, res) => {
  const { type } = req.params;
  const userId = req.userId;

  try {
    const snapshot = await db.collection("transactions")
      .where("type", "==", type)
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { amount, description, date, categoryId } = req.body;

  try {
    const docRef = db.collection("transactions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await docRef.update({
      amount,
      description,
      date: new Date(date),
      categoryId
    });

    res.json({ message: "Transaction updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating transaction", error: err });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const docRef = db.collection("transactions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await docRef.delete();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction", error: err });
  }
};

