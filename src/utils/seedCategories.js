const { db } = require("../config/firebase");

const defaultCategories = [
{ name: "Chợ, siêu thị", icon: "basket", color: "#f46e45", type: "expense", isDefault: true, userId: null },
    { name: "Ăn uống", icon: "fast-food", color: "#f46e45", type: "expense", isDefault: true, userId: null },
    { name: "Di chuyển", icon: "car", color: "#62aef7", type: "expense", isDefault: true, userId: null },
    { name: "Mua sắm", icon: "cart", color: "#f6b100", type: "expense", isDefault: true, userId: null },
    { name: "Giải trí", icon: "play", color: "#f7b8c8", type: "expense", isDefault: true, userId: null },
    { name: "Làm đẹp", icon: "cut", color: "#ef60a3", type: "expense", isDefault: true, userId: null },
    { name: "Sức khỏe", icon: "heart", color: "#f5536c", type: "expense", isDefault: true, userId: null },
    { name: "Từ thiện", icon: "gift", color: "#f58cd2", type: "expense", isDefault: true, userId: null },
    { name: "Hóa đơn", icon: "document-text", color: "#2ec3a2", type: "expense", isDefault: true, userId: null },
    { name: "Nhà cửa", icon: "home", color: "#937be1", type: "expense", isDefault: true, userId: null },
    { name: "Người thân", icon: "people", color: "#f57cac", type: "expense", isDefault: true, userId: null },
    { name: "Đầu tư", icon: "trending-up", color: "#4caf50", type: "expense", isDefault: true, userId: null },
    { name: "Tiết kiệm", icon: "wallet", color: "#4caf50", type: "expense", isDefault: true, userId: null },
    { name: "Thưởng", icon: "medal", color: "#28a745", type: "income", isDefault: true, userId: null },
    { name: "Tiền lãi", icon: "trending-up", color: "#17a2b8", type: "income", isDefault: true, userId: null },
    { name: "Tiền gửi", icon: "wallet", color: "#17a2b8", type: "income", isDefault: true, userId: null },
    { name: "Bán hàng", icon: "bag-handle", color: "#ffc107", type: "income", isDefault: true, userId: null },
    { name: "Đầu tư khác", icon: "analytics", color: "#007bff", type: "income", isDefault: true, userId: null },
    { name: "Quà tặng", icon: "gift", color: "#fd7e14", type: "income", isDefault: true, userId: null },
    { name: "Hoàn tiền", icon: "refresh", color: "#6c757d", type: "income", isDefault: true, userId: null },
    { name: "Thu nhập phụ", icon: "briefcase", color: "#6f42c1", type: "income", isDefault: true, userId: null },
    { name: "Tiền thừa", icon: "receipt", color: "#dc3545", type: "income", isDefault: true, userId: null }

];

async function seedCategories() {
  for (const cat of defaultCategories) {
    await db.collection("categories").add(cat);
    console.log(`Seeded: ${cat.name}`);
  }
  console.log("✅ All default categories seeded successfully.");
}

seedCategories();
