module.exports = (req, res) => {
  const html = `
  <html>
    <head>
      <title>Auth API Docs</title>
      <style>
        body {
          font-family: monospace;
          background: #f6f8fa;
          padding: 20px;
        }
        h2 {
          color: #333;
        }
        .block {
          margin-bottom: 30px;
        }
        pre {
          background: #fff;
          border: 1px solid #ccc;
          padding: 10px;
          overflow: auto;
        }
      </style>
    </head>
    <body>
      <h1>Auth API Documentation</h1>

      <div class="block">
        <h2>1. Signin</h2>
        <strong>POST</strong> http://localhost:3001/api/signin
        <pre>{
  "email": "nguyenvana@example.com",
  "password": "123456"
}</pre>
      </div>

      <div class="block">
        <h2>2. Forgot Password - Send Code</h2>
        <strong>POST</strong> http://localhost:3001/api/forgot-password/send-code
        <pre>{
  "email": "nguyenvana@example.com"
}</pre>
      </div>

      <div class="block">
        <h2>3. Forgot Password - Verify Code</h2>
        <strong>POST</strong> http://localhost:3001/api/forgot-password/verify-code
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234"
}</pre>
      </div>

      <div class="block">
        <h2>4. Forgot Password - Reset</h2>
        <strong>POST</strong> http://localhost:3001/api/forgot-password/reset
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234",
  "newPassword": "654321"
}</pre>
      </div>

      <div class="block">
        <h2>5. Signup - Send Code</h2>
        <strong>POST</strong> http://localhost:3001/api/signup/send-code
        <pre>{
  "email": "nguyenvana@example.com"
}</pre>
      </div>

      <div class="block">
        <h2>6. Signup - Verify Code</h2>
        <strong>POST</strong> http://localhost:3001/api/signup/verify-code
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234"
}</pre>
      </div>

      <div class="block">
        <h2>7. Signup - Finalize</h2>
        <strong>POST</strong> http://localhost:3001/api/signup
        <pre>{
  "username": "nguyenvana",
  "phone": "0123456789",
  "email": nguyenvana@example.com",
  "password": "123456",
  "code": "1234"
}</pre>
      </div>

    
      <div class="block">
        <h2>8. Add Transaction (Expense)</h2>
        <strong>POST</strong> http://localhost:3001/api/transactions/expense
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
        <pre>{
  "categoryId": "6DirVHgLD3zqPS1DZUvo",
  "amount": 120000,
  "description": "Mua đồ ăn vặt",
  "date": "2025-06-22T10:00:00.000Z"
}</pre>
      </div>

      <div class="block">
        <h2>9. Add Transaction (Income)</h2>
        <strong>POST</strong> http://localhost:3001/api/transactions/income
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
        <pre>{
  "categoryId": "abc123",
  "amount": 500000,
  "description": "Lương tháng 6",
  "date": "2025-06-20T09:00:00.000Z"
}</pre>
      </div>

      <div class="block">
        <h2>10. Get Transactions</h2>
        <strong>GET</strong> http://localhost:3001/api/transactions/expense
        <br><strong>GET</strong> http://localhost:3001/api/transactions/income
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
      </div>

      <div class="block">
        <h2>11. Update Transaction</h2>
        <strong>PUT</strong> http://localhost:3001/api/transactions/&lt;transactionId&gt;
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
        <pre>{
  "amount": 99000,
  "description": "Chỉnh sửa lại",
  "date": "2025-06-23T08:00:00.000Z",
  "categoryId": "abc123"
}</pre>
      </div>

      <div class="block">
        <h2>12. Delete Transaction</h2>
        <strong>DELETE</strong> http://localhost:3001/api/transactions/&lt;transactionId&gt;
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
      </div>

      <div class="block">
        <h2>13. Get Categories</h2>
        <strong>GET</strong> http://localhost:3001/api/categories?type=expense
        <br><strong>GET</strong> http://localhost:3001/api/categories?type=income
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
      </div>

      <div class="block">
        <h2>14. Add Category (User-defined)</h2>
        <strong>POST</strong> http://localhost:3001/api/categories
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
        <pre>{
  "name": "Mèo cưng",
  "iconId": "gift",
  "type": "expense"
}</pre>
      </div>

      <div class="block">
        <h2>15. Delete User Category</h2>
        <strong>DELETE</strong> http://localhost:3001/api/categories/&lt;categoryId&gt;
        <br><strong>Headers:</strong> Authorization: Bearer &lt;token&gt;
      </div>

    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
};
