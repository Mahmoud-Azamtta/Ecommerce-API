export const verifyEmailTemplate = (name, verificationEndpoint) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            margin-bottom: 20px;
            font-size: 16px;
            color: #555555;
        }
        .button-container {
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff !important;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for registering. Please click the button below to verify your email address.</p>
        </div>
        <div class="button-container">
            <a href="${verificationEndpoint}" class="button">Verify Email</a>
        </div>
        <div class="content">
            <p>If you did not create an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

export const verificationCodeEmail = (code) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    color: #333;
    text-align: center;
    padding: 40px 20px;
  }
  .container {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: inline-block;
    max-width: 400px;
  }
  .code {
    font-size: 24px;
    color: #007BFF;
    font-weight: bold;
    margin-top: 20px;
    padding: 10px;
    border: 2px dashed #007BFF;
    display: inline-block;
  }
  .footer {
    font-size: 12px;
    color: #666;
    margin-top: 20px;
    text-align: center;
  }
  .footer a {
    color: #007BFF;
    text-decoration: none;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Your Code:</h1>
  <div class="code">${code}</div>
  <div class="footer">
    <p>Need help? <a href="mailto:${process.env.SENDER_EMAIL}">Contact us</a></p>
    <p>Follow us on <a href="https://twitter.com/example">Twitter</a> | <a href="https://facebook.com/example">Facebook</a></p>
  </div>
</div>
</body>
</html>
`;
};
