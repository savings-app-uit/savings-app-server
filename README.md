## 📦 Environment Setup
1. **Thêm các package**
   ```bash
   npm install express bcryptjs jsonwebtoken dotenv firebase-admin nodemailer multer cloudinary streamifier @google/generative-ai
   ```

2. **Tạo file `.env` từ file mẫu ở dưới:**

   ```bash
   cp .env
   ```

3. **Điền các biến môi trường vào `.env` theo cấu trúc sau:**

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

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=dvfukrnu5
   CLOUDINARY_API_KEY=924876963489893
   CLOUDINARY_API_SECRET=w_Oeq8u24WZ7fc5fAeXH3US6of0

   #API KEY GEMINI
   GEMINI_API_KEY=AIzaSyCkKtcdRkTWK9muXmAE0G3kA9jNKcIyBZg

4. **Cài đặt dependencies:**

   ```bash
   npm install
   ```

5. **Chạy server:**

   ```bash
   node src/index.js
   ```

> 🔒 Ghi nhớ: KHÔNG push file `.env` thật lên GitHub. Đã được ignore trong `.gitignore`.
