exports.resetPasswordTemplate = (resetUrl, firstName) => {
    return `
    <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Hi ${firstName},</p>

        <p>You recently requested to reset your password. Click the button below to reset it:</p>

        <a href="${resetUrl}" 
           style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
        </a>

        <p>If the button doesn’t work, copy and paste this link:</p>
        <p>${resetUrl}</p>

        <br/>
        <p>If you did not request this, please ignore this email.</p>

        <p><b>Thank you,<br/>Your Team</b></p>
    </div>
    `;
};
