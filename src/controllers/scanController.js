const { executePythonScript } = require("../utils/pythonExecutor");
const path = require("path");
const fs = require("fs");
const { db } = require("../config/firebase"); // ✅ THÊM: Import firestore instance

exports.scanImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    console.log(`Processing image for user ${req.userId}: ${imagePath}`);

    // 1. Chạy script Python và nhận kết quả JSON thô
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
      return res.status(400).json({ 
          success: false, 
          error: classificationResult.error 
      });
    }
    
    // ✅ BẮT ĐẦU LOGIC MỚI TẠI NODE.JS
    
    // 4. Lấy dữ liệu thô từ kết quả của Python
    const { 
      category: categoryName, // 'category' bây giờ là tên danh mục
      invoice_date: date, 
      total_amount: amount 
    } = classificationResult;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        error: "Model could not determine a category."
      });
    }

    // 5. Truy vấn danh mục trong Firestore bằng tên lấy từ Python
    const categoriesRef = db.collection("categories");
    const categorySnapshot = await categoriesRef
      .where("name", "==", categoryName)
      .where("type", "==", "expense")
      .where("isDefault", "==", true)
      .limit(1)
      .get();

    // Báo lỗi nếu không tìm thấy danh mục tương ứng trong CSDL
    if (categorySnapshot.empty) {
      console.error(`Category '${categoryName}' predicted by model not found in Firestore.`);
      return res.status(404).json({
        success: false,
        error: `Category '${categoryName}' not found in database.`
      });
    }

    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    
    // 6. Lấy thông tin icon liên quan
    let iconData = null;
    if (categoryData.iconId) {
      const iconDoc = await db.collection("icons").doc(categoryData.iconId).get();
      if (iconDoc.exists) {
        iconData = iconDoc.data();
      }
    }
    
    // 7. Tạo đối tượng JSON cuối cùng theo đúng định dạng yêu cầu
    const finalResponse = {
      category: {
        id: categoryDoc.id,
        name: categoryData.name,
        iconId: categoryData.iconId,
        type: categoryData.type,
        isDefault: categoryData.isDefault,
        userId: categoryData.userId,
        icon: {
          icon: iconData ? iconData.icon : null,
          color: iconData ? iconData.color : null,
        },
      },
      date: date,
      amount: amount,
    };
    
    // 8. Trả về kết quả cho client
    res.status(200).json(finalResponse);

  } catch (error) {
    console.error("Scan error details:", error);
    res.status(500).json({ 
        success: false,
        error: "Server error during image processing" 
    });
  }
};