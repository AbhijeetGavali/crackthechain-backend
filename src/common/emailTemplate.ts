import { FRONTEND_WEB_URL, BACKEND_URL } from "./constants";

export const emailTemplate = {
  base: (child: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: #121212;
      color: #e0e0e0;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #1e1e1e;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      border: 1px solid #333;
    }
    .header {
      background-color: #0f9d58;
      color: #121212;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      border-radius: 8px 8px 0 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      padding: 20px;
      color: #e0e0e0;
    }
    .content p {
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      background-color: #0f9d58;
      color: #121212;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    a {
      color: #0f9d58;
    }
  </style>
</head>
<body>
  ${child}
</body>
</html>
`,

  resetPassword: (token: string) =>
    emailTemplate.base(`
    <div class="email-container">
      <div class="header">CrackTheChain</div>
      <div class="content">
        <p>Greetings,</p>
        <p>You have requested a password reset for your CrackTheChain account. Click the button below to reset your password.</p>
        <p><a href="${FRONTEND_WEB_URL}/update-password?token=${token}" class="button">Reset Password</a></p>
        OR
        copy paste the link below in your browser
        <p>${FRONTEND_WEB_URL}/update-password?token=${token}</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrackTheChain. All rights reserved.</p>
      </div>
    </div>
  `),

  signupEmail: (token: string) =>
    emailTemplate.base(`
    <div class="email-container">
      <div class="header">CrackTheChain</div>
      <div class="content">
        <p>Greetings,</p>
        <p>Your CrackTheChain account has been created successfully. Click the button below to verify your email.</p>
        <p><a href="${BACKEND_URL}/api/v1/users/auth/verify-email?token=${token}" class="button">Verify Email</a></p>
        OR
        copy paste the link below in your browser
        <p>${BACKEND_URL}/api/v1/users/auth/verify-email?token=${token}</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 CrackTheChain. All rights reserved.</p>
      </div>
    </div>
  `),
};
