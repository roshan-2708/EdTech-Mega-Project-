const nodemailer = require("nodemailer");

const mailSender = async (email, subject, htmlBody) => {
    try {
        // Create Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // For TLS
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // Mail Options
        const info = await transporter.sendMail({
            from: `"Mega Learning" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlBody,
        });

        console.log("📧 Email sent:", info.messageId);
        return info;

    } catch (error) {
        console.error("❌ Error in mailSender:", error.message);
        return null;
    }
};

module.exports = mailSender;
