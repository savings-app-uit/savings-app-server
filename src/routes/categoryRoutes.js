const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const verifyToken = require('../middlewares/verifyToken'); 

router.get('/', verifyToken, controller.getCategories);
router.post('/', verifyToken, controller.addCategory); 
router.delete('/:id', verifyToken, controller.deleteCategory);

module.exports = router;
