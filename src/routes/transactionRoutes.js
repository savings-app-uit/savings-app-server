const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');

router.post('/income', (req, res) => {
  controller.addTransaction({ ...req, body: { ...req.body, type: 'income' } }, res);
});

router.post('/expense', (req, res) => {
  controller.addTransaction({ ...req, body: { ...req.body, type: 'expense' } }, res);
});

module.exports = router;
