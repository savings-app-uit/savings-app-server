// controllers/rewindController.js

const { db } = require("../config/firebase");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

/**
 * Trả về thông tin tháng trước, ví dụ: "tháng 5 năm 2025"
 */
const getPreviousMonthInfo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const month = date.toLocaleString('vi-VN', { month: 'long' });
    const year = date.getFullYear();
    return `${month} năm ${year}`;
};

/**
 * Tạo prompt chi tiết gửi đến Gemini API
 */
function createGeminiPrompt(username, monthInfo, data) {
    const formatVND = (num) => num.toLocaleString('vi-VN') + ' VND';

    return `
    Bạn là một trợ lý tài chính AI thân thiện trong ứng dụng quản lý chi tiêu. Dựa vào dữ liệu chi tiêu tháng ${monthInfo} của người dùng ${username}, hãy viết một báo cáo tổng kết "rewind" cá nhân hóa dạng slide như sau:

    - Gọi tên người dùng là "${username}".
    - Sử dụng giọng văn tích cực, vui vẻ, gần gũi.
    - Trả về CHỈ MỘT đối tượng JSON đúng cú pháp, không chứa text ngoài JSON.
    - Thêm từ ngữ trendy, emoji sinh động, biểu cảm phù hợp.
    - Cố định đúng **7 slide**, MỖI SLIDE có một type duy nhất trong danh sách sau:

    **Danh sách cố định các loại slide (type):**
    1. "intro"
    2. "top_category"
    3. "big_transaction"
    4. "weekend_trend"
    5. "suggestion"
    6. "fun_fact"
    7. "motivation"

    - Nếu thiếu dữ kiện cho 1 type, hãy xử lý sáng tạo hoặc đưa lời khuyên thay thế.
    - KHÔNG tạo type khác ngoài danh sách trên.
    - Đảm bảo thứ tự giữ nguyên.

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
          "type": "string", 
          "title": "string", 
          "message": "string", 
          "data": object (tùy chọn)
        }
      ]
    }
    `;
}

/**
 * Hàm chính tạo Rewind
 */
exports.generateRewind = async (req, res) => {
    try {
        const userId = req.userId;

        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() - 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;

        const rewindsRef = db.collection('rewinds');
        const cacheQuery = await rewindsRef
            .where('userId', '==', userId)
            .where('year', '==', year)
            .where('month', '==', month)
            .limit(1)
            .get();

        if (!cacheQuery.empty) {
            const cachedRewind = cacheQuery.docs[0].data();
            return res.status(200).json(cachedRewind.data);
        }

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);

        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const username = userDoc.data().username || "Bạn";

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
            return res.status(200).json(null); // ✅ Trả về null nếu không có dữ liệu
        }

        let totalExpense = 0;
        let largestExpense = { name: "Không có", amount: 0 };
        const categorySpending = new Map();
        let weekendSpending = 0;

        transactionsSnapshot.forEach(doc => {
            const transaction = doc.data();
            const transactionDate = transaction.date.toDate();

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
                if (transaction.amount > largestExpense.amount) {
                    largestExpense = { name: transaction.description, amount: transaction.amount };
                }
                const currentAmount = categorySpending.get(transaction.categoryId) || 0;
                categorySpending.set(transaction.categoryId, currentAmount + transaction.amount);

                const day = transactionDate.getDay();
                if ([0, 5, 6].includes(day)) {
                    weekendSpending += transaction.amount;
                }
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

        const topCategory = {
            name: categoriesMap.get(topCategoryId) || "Khác",
            amount: maxAmount,
            percentage: totalExpense > 0 ? Math.round((maxAmount / totalExpense) * 100) : 0
        };

        const weekendPercentage = totalExpense > 0 ? Math.round((weekendSpending / totalExpense) * 100) : 0;

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

        const newRewindPayload = {
            userId: userId,
            month: month,
            year: year,
            data: rewindData,
            createdAt: new Date()
        };

        await db.collection('rewinds').add(newRewindPayload);
        res.status(200).json(rewindData);

    } catch (error) {
        console.error("Error in generateRewind:", error);
        res.status(500).json({ error: "Failed to generate financial rewind.", details: error.message });
    }
};
