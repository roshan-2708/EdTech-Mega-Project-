exports.emailVerificationTemplate = (name, otp) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
  </head>
  <body style="background-color: #f6f6f6; margin: 0; padding: 0;">
      <div style="
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px 40px;
          border-radius: 12px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
          <!-- Logo -->
          <div style="text-align: center;">
              <h2 style="color: #4f46e5; margin-bottom: 6px;">Mega Learning</h2>
              <p style="color: #777; margin-top: 0;">Email Verification Required</p>
          </div>

          <!-- Greeting -->
          <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>

          <!-- Message -->
          <p style="font-size: 15px; color: #555;">
              Thank you for signing up at <strong>Mega Learning</strong>!  
              To complete your registration and activate your account, please verify your email address using the OTP below.
          </p>

          <!-- OTP Box -->
          <div style="
              background: #f1f5f9;
              padding: 20px 0;
              text-align: center;
              border-radius: 10px;
              margin: 25px 0;
              border: 1px solid #e2e8f0;
          ">
              <span style="
                  font-size: 32px;
                  color: #1e293b;
                  letter-spacing: 4px;
                  font-weight: bold;
                  display: block;
              ">${otp}</span>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 20px;">
              This OTP is valid for <strong>10 minutes</strong>.  
              Please do not share it with anyone for security reasons.
          </p>

          <!-- Security Tips -->
          <div style="
              background: #fef3c7;
              padding: 12px 15px;
              border-left: 4px solid #f59e0b;
              border-radius: 6px;
              margin-top: 20px;
              font-size: 14px;
              color: #92400e;
          ">
              ⚠️ If you did not request this, please ignore this email or contact our support team.
          </div>

          <!-- Footer -->
          <p style="font-size: 13px; color: #999; text-align: center; margin-top: 30px;">
              © ${new Date().getFullYear()} Mega Learning. All rights reserved.
          </p>
      </div>
  </body>
  </html>
  `;
};
