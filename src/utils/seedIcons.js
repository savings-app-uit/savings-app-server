
const { db } = require("../config/firebase");

const icons = [
  { id: "basket", id: "basket", color: "#f46e45" },
  { id: "fast-food", icon: "fast-food", color: "#f46e45" },
  { id: "car", icon: "car", color: "#62aef7" },
  { id: "cart", icon: "cart", color: "#f6b100" },
  { id: "play", icon: "play", color: "#f7b8c8" },
  { id: "cut", icon: "cut", color: "#ef60a3" },
  { id: "heart", icon: "heart", color: "#f5536c" },
  { id: "gift", icon: "gift", color: "#fd7e14" },
  { id: "document-text", icon: "document-text", color: "#2ec3a2" },
  { id: "home", icon: "home", color: "#937be1" },
  { id: "people", icon: "people", color: "#f57cac" },
  { id: "trending-up", icon: "trending-up", color: "#17a2b8" },
  { id: "wallet", icon: "wallet", color: "#17a2b8" },
  { id: "medal", icon: "medal", color: "#28a745" },
  { id: "bag-handle", icon: "bag-handle", color: "#ffc107" },
  { id: "analytics", icon: "analytics", color: "#007bff" },
  { id: "refresh", icon: "refresh", color: "#6c757d" },
  { id: "briefcase", icon: "briefcase", color: "#6f42c1" },
  { id: "receipt", icon: "receipt", color: "#dc3545" }
];

async function seedIcons() {
  for (const icon of icons) {
    await db.collection("icons").doc(icon.id).set(icon);
    console.log(`✅ Seeded icon: ${icon.id}`);
  }
  console.log("🌟 All icons seeded successfully.");
}

seedIcons();
