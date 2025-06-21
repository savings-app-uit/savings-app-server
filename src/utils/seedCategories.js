
const { db } = require("../config/firebase");

const defaultCategories = [
  { name: "Chợ, siêu thị", iconId: "basket", type: "expense", isDefault: true, userId: null },
  { name: "Ăn uống", iconId: "fast-food", type: "expense", isDefault: true, userId: null },
  { name: "Di chuyển", iconId: "car", type: "expense", isDefault: true, userId: null },
  { name: "Mua sắm", iconId: "cart", type: "expense", isDefault: true, userId: null },
  { name: "Giải trí", iconId: "play", type: "expense", isDefault: true, userId: null },
  { name: "Làm đẹp", iconId: "cut", type: "expense", isDefault: true, userId: null },
  { name: "Sức khỏe", iconId: "heart", type: "expense", isDefault: true, userId: null },
  { name: "Từ thiện", iconId: "gift", type: "expense", isDefault: true, userId: null },
  { name: "Hóa đơn", iconId: "document-text", type: "expense", isDefault: true, userId: null },
  { name: "Nhà cửa", iconId: "home", type: "expense", isDefault: true, userId: null },
  { name: "Người thân", iconId: "people", type: "expense", isDefault: true, userId: null },
  { name: "Đầu tư", iconId: "trending-up", type: "expense", isDefault: true, userId: null },
  { name: "Tiết kiệm", iconId: "wallet", type: "expense", isDefault: true, userId: null },
  { name: "Thưởng", iconId: "medal", type: "income", isDefault: true, userId: null },
  { name: "Tiền lãi", iconId: "trending-up", type: "income", isDefault: true, userId: null },
  { name: "Tiền gửi", iconId: "wallet", type: "income", isDefault: true, userId: null },
  { name: "Bán hàng", iconId: "bag-handle", type: "income", isDefault: true, userId: null },
  { name: "Đầu tư khác", iconId: "analytics", type: "income", isDefault: true, userId: null },
  { name: "Quà tặng", iconId: "gift", type: "income", isDefault: true, userId: null },
  { name: "Hoàn tiền", iconId: "refresh", type: "income", isDefault: true, userId: null },
  { name: "Thu nhập phụ", iconId: "briefcase", type: "income", isDefault: true, userId: null },
  { name: "Tiền thừa", iconId: "receipt", type: "income", isDefault: true, userId: null }
];

async function seedCategories() {
  for (const cat of defaultCategories) {
    await db.collection("categories").add(cat);
    console.log(`✅ Seeded: ${cat.name}`);
  }
  console.log("🌱 All default categories seeded successfully.");
}

seedCategories();
