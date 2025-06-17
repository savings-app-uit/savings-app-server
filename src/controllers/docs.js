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
        <strong>POST</strong> http://localhost:3001/signin
        <pre>{
  "email": "nguyenvana@example.com",
  "password": "123456"
}</pre>
      </div>

      <div class="block">
        <h2>2. Forgot Password - Send Code</h2>
        <strong>POST</strong> http://localhost:3001/forgot-password/send-code
        <pre>{
  "email": "nguyenvana@example.com"
}</pre>
      </div>

      <div class="block">
        <h2>3. Forgot Password - Verify Code</h2>
        <strong>POST</strong> http://localhost:3001/forgot-password/verify-code
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234"
}</pre>
      </div>

      <div class="block">
        <h2>4. Forgot Password - Reset</h2>
        <strong>POST</strong> http://localhost:3001/forgot-password/reset
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234",
  "newPassword": "654321"
}</pre>
      </div>

      <div class="block">
        <h2>5. Signup (Send OTP)</h2>
        <strong>POST</strong> http://localhost:3001/signup
        <pre>{
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "password": "123456"
}</pre>
      </div>

      <div class="block">
        <h2>6. Signup - Verify Code</h2>
        <strong>POST</strong> http://localhost:3001/signup/verify-code
        <pre>{
  "email": "nguyenvana@example.com",
  "code": "1234"
}</pre>
      </div>

    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
};