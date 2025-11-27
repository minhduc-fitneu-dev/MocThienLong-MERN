// utils/VerificationEmail.js
const VerificationEmail = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification - Mộc Thiên Long</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: #f7f5f0;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 32px auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 32px;
        border: 1px solid #e3d6c5;
        box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      }
      .brand {
        text-align: center;
        margin-bottom: 16px;
      }
      .brand h1 {
        font-size: 26px;
        font-weight: 700;
        color: #7a4e20;
        margin: 0;
      }
      .brand span {
        font-size: 14px;
        color: #b38c58;
      }
      .divider {
        width: 80px;
        height: 3px;
        background: #c89b63;
        margin: 14px auto 26px auto;
        border-radius: 6px;
      }
      .content {
        text-align: center;
        color: #4b3b28;
      }
      .content p {
        font-size: 15px;
        line-height: 1.6;
      }
      .otp-box {
        margin: 26px auto;
        display: inline-block;
        background: #f4eadf;
        padding: 14px 26px;
        border-radius: 8px;
        border: 1px solid #d8c1a3;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #7a4e20;
      }
      .footer {
        text-align: center;
        margin-top: 32px;
        font-size: 13px;
        color: #9a8b7b;
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div class="brand">
        <h1>Mộc Thiên Long</h1>
        <span>Nâng niu giá trị tự nhiên</span>
      </div>
      <div class="divider"></div>

      <div class="content">
        <p>Xin chào <strong>${username}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Mộc Thiên Long</strong>.</p>
        <p>Vui lòng sử dụng mã xác thực bên dưới để hoàn tất bước xác minh email:</p>

        <div class="otp-box">${otp}</div>

        <p>Mã OTP có hiệu lực trong 60 giây.</p>
        <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
      </div>

      <div class="footer">
        <p>© 2024 Mộc Thiên Long. All rights reserved.</p>
      </div>

    </div>
  </body>
</html>`;
};

export default VerificationEmail;
