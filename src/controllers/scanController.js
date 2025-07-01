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

    // 1. Chạy script Python và nhận kết quả JSON
    const classificationResult = await executePythonScript(imagePath);

    // 2. Xóa file ảnh tạm sau khi xử lý xong
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }

    // 3. Kiểm tra kết quả từ script Python
    if (!classificationResult.success) {
      console.error("Classification failed:", classificationResult.error);
      // Trả về lỗi nếu script Python có lỗi
      return res.status(400).json({ 
          success: false, 
          error: classificationResult.error 
      });
    }

    // 4. Gửi thẳng kết quả JSON nhận được từ script Python về cho Frontend
    // Không cần truy vấn CSDL hay chỉnh sửa gì thêm.
    res.status(200).json(classificationResult);

  } catch (error) {
    console.error("Scan error details:", error);
    res.status(500).json({ 
        success: false,
        error: "Server error during image processing" 
    });
  }
};