## 📦 Environment Setup

1. **Tạo file `.env` từ file mẫu:**

   ```bash
   cp .env.example .env
   ```

2. **Điền các biến môi trường vào `.env` theo cấu trúc sau:**

   ```env
   # 🔐 Firebase Service Account
   FIREBASE_KEY_PATH=./firebase/serviceAccountKey.json

   # 🔑 JWT Secret for Token Signing
   JWT_SECRET=aJ7g!9Zm#T@4&vSdNw3kXp$0uQeLm!rC

   # 🕒 OTP Expiration (in seconds)
   OTP_EXPIRE_TIME=300

   # 📧 Email Configuration
   EMAIL_USER=hoanghaiyencbm@gmail.com
   EMAIL_PASS=nhxwkyvvnibmsvii

   # 🌐 Server Port
   PORT=3001

3. **Cài đặt dependencies:**

   ```bash
   npm install
   ```

4. **Chạy server:**

   ```bash
   node src/index.js
   ```

> 🔒 Ghi nhớ: KHÔNG push file `.env` thật lên GitHub. Đã được ignore trong `.gitignore`.
