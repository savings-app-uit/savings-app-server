// controllers/rewindController.js

const { db } = require("../config/firebase");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Khởi tạo Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

// ... (Các hàm helper getPreviousMonthInfo và createGeminiPrompt giữ nguyên như trước)
/**
 * Hàm lấy tên và năm của tháng trước.
 * @returns {string} Ví dụ: "tháng 5 năm 2025"
 */
const getPreviousMonthInfo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString('vi-VN', { month: 'long' });
    const year = date.getFullYear();
    return `${month} năm ${year}`;
};

/**
 * Hàm tạo prompt chi tiết để gửi đến Gemini API.
 * @param {string} username - Tên người dùng.
 * @param {string} monthInfo - Thông tin tháng, ví dụ: "tháng 5 năm 2025".
 * @param {object} data - Dữ liệu tài chính đã được xử lý.
 * @returns {string} - Chuỗi prompt hoàn chỉnh.
 */
function createGeminiPrompt(username, monthInfo, data) {
    const formatVND = (num) => num.toLocaleString('vi-VN') + ' VND';

    return `
    Bạn là một trợ lý tài chính AI thân thiện trong ứng dụng quản lý chi tiêu. Dựa vào dữ liệu chi tiêu tháng ${monthInfo} của người dùng ${username}, hãy viết một báo cáo tổng kết "rewind" cá nhân hóa dạng slide như sau:

    - Gọi tên người dùng là "${username}".
    - Sử dụng giọng văn tích cực, vui vẻ, gần gũi.
    - Dựa trên dữ liệu chi tiêu đã tổng hợp bên dưới.
    - Trả về CHỈ MỘT đối tượng JSON đúng cú pháp, không chứa text ngoài JSON.
    - Thêm các từ ngữ trendy, các icon sinh động, emoji phù hợp với từng slide.

    **Dữ liệu đầu vào:**
    * Tổng chi tiêu: ${formatVND(data.totalExpense)}
    * Danh mục chi tiêu nhiều nhất: ${data.topCategory.name}, ${formatVND(data.topCategory.amount)}, chiếm ${data.topCategory.percentage}%
    * Giao dịch lớn nhất: ${data.largestExpense.name}, ${formatVND(data.largestExpense.amount)}
    * Tỷ lệ chi tiêu cuối tuần: ${data.weekendPercentage}%

    **Yêu cầu định dạng JSON:**
    {
    "rewind_title": "Tiêu đề tổng kết tháng ${monthInfo}",
    "slides": [
        {
        "type": "string", // Ví dụ: intro, weekend_trend, top_category, suggestion, motivation, insight, saving_tip, ...
        "title": "string", // Sáng tạo, nhiều màu sắc
        "message": "string", // Cá nhân hóa, vui vẻ, dùng dữ kiện tài chính
        "data": object (tùy chọn) // Chứa dữ liệu nếu cần
        }
    ]
    }

    Hãy làm cho mỗi lần sinh nội dung đều mang tính sáng tạo, cá nhân hóa và không bị trùng lặp.
    - Nếu người dùng chi nhiều vào cuối tuần, hãy thêm slide "weekend_trend".
    - Nếu có một danh mục chi tiêu quá trội, hãy đưa lời khuyên phù hợp.
    - Nếu chi tiêu ít, hãy khen ngợi là người tiết kiệm.
    - Có thể tạo 1 slide “fun fact” nếu có điều gì đó bất ngờ.
    `;

}


/**
 * Hàm xử lý chính để tạo Rewind
 */
exports.generateRewind = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. TÍNH TOÁN THÁNG VÀ NĂM CẦN KIỂM TRA
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() - 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1; // getMonth() trả về từ 0-11, nên cần +1

        // 2. KIỂM TRA DỮ LIỆU ĐÃ CÓ TRONG DATABASE (CACHE) CHƯA
        const rewindsRef = db.collection('rewinds');
        const cacheQuery = await rewindsRef
            .where('userId', '==', userId)
            .where('year', '==', year)
            .where('month', '==', month)
            .limit(1)
            .get();

        if (!cacheQuery.empty) {
            console.log(`Serving rewind for user ${userId} for ${month}/${year} from cache.`);
            const cachedRewind = cacheQuery.docs[0].data();
            // Trả về trường `data` chứa đối tượng JSON
            return res.status(200).json(cachedRewind.data);
        }
        
        console.log(`No cache found. Generating new rewind for user ${userId} for ${month}/${year}.`);

        // 3. NẾU KHÔNG CÓ CACHE, TIẾP TỤC LOGIC CŨ ĐỂ TẠO MỚI
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        const username = userDoc.data().username || "Bạn";

        // ... (phần lấy categories và transactions giữ nguyên)
        const categoriesSnapshot = await db.collection("categories").get();
        const categoriesMap = new Map();
        categoriesSnapshot.forEach(doc => {
            categoriesMap.set(doc.id, doc.data().name);
        });

        const transactionsSnapshot = await db.collection("transactions")
            .where("userId", "==", userId)
            .where("date", ">=", startOfMonth)
            .where("date", "<=", endOfMonth)
            .get();

        if (transactionsSnapshot.empty) {
            return res.status(200).json({ 
                rewind_title: "Chưa có dữ liệu tháng trước",
                slides: [{
                    type: "intro",
                    title: "Chào " + username + "!",
                    message: "Rất tiếc, chúng tôi không tìm thấy giao dịch nào của bạn trong tháng trước. Hãy bắt đầu ghi chép ngay hôm nay để nhận được tổng kết vào tháng sau nhé! 📝"
                }]
            });
        }

        // ... (phần xử lý và tổng hợp dữ liệu giữ nguyên)
        let totalExpense = 0;
        let largestExpense = { name: "Không có", amount: 0 };
        const categorySpending = new Map();
        let weekendSpending = 0;

        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            const transactionDate = transaction.date.toDate();

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
                if (transaction.amount > largestExpense.amount) { largestExpense = { name: transaction.description, amount: transaction.amount }; }
                const currentAmount = categorySpending.get(transaction.categoryId) || 0;
                categorySpending.set(transaction.categoryId, currentAmount + transaction.amount);
                const dayOfWeek = transactionDate.getDay();
                if ([0, 5, 6].includes(dayOfWeek)) { weekendSpending += transaction.amount; }
            }
        });
        
        let topCategoryId = null;
        let maxAmount = 0;
        for (const [categoryId, amount] of categorySpending.entries()) {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategoryId = categoryId;
            }
        }

        const topCategory = { name: categoriesMap.get(topCategoryId) || "Khác", amount: maxAmount, percentage: totalExpense > 0 ? Math.round((maxAmount / totalExpense) * 100) : 0 };
        const weekendPercentage = totalExpense > 0 ? Math.round((weekendSpending / totalExpense) * 100) : 0;
        

        // 4. GỌI GEMINI API
        const prompt = createGeminiPrompt(username, getPreviousMonthInfo(), {
            totalExpense,
            topCategory,
            largestExpense,
            weekendPercentage
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const rewindData = JSON.parse(jsonString);

        // 5. LƯU KẾT QUẢ VÀO DATABASE ĐỂ CACHE
        const newRewindPayload = {
            userId: userId,
            month: month,
            year: year,
            data: rewindData, // Lưu toàn bộ đối tượng JSON vào trường `data`
            createdAt: new Date() // Thêm timestamp để biết khi nào nó được tạo
        };

        await db.collection('rewinds').add(newRewindPayload);
        console.log(`New rewind for user ${userId} for ${month}/${year} saved to database.`);

        // 6. TRẢ VỀ KẾT QUẢ CHO NGƯỜI DÙNG
        res.status(200).json(rewindData);

    } catch (error) {
        console.error("Error in generateRewind:", error);
        res.status(500).json({ error: "Failed to generate financial rewind.", details: error.message });
    }
};