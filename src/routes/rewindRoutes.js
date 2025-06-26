const express = require("express");
const router = express.Router();

// Import middleware để xác thực người dùng (giả sử bạn đã có file này)
const verifyToken = require("../middlewares/verifyToken");

// Import controller chứa logic xử lý
const rewindController = require("../controllers/rewindController");

/**
 * @route   GET /api/rewind
 * @desc    Tạo một bản tổng kết tài chính (rewind) của tháng trước cho người dùng
 * @access  Private
 */
router.get("/", verifyToken, rewindController.generateRewind);

module.exports = router;