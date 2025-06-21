const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/income', verifyToken, (req, res) => {
  controller.addTransaction({ ...req, body: { ...req.body, type: 'income' } }, res);
});

router.post('/expense', verifyToken, (req, res) => {
  controller.addTransaction({ ...req, body: { ...req.body, type: 'expense' } }, res);
});

router.get('/:type', verifyToken, controller.getTransactions);
router.put('/:id', verifyToken, controller.updateTransaction);
router.delete('/:id', verifyToken, controller.deleteTransaction);

module.exports = router;
