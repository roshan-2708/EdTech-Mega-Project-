


// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// const mailSender = async (email, title, body) => {
//     try {
//         await resend.emails.send({
//             from: "StudyNotion <onboarding@resend.dev>",
//             to: email,
//             subject: title,
//             html: body,
//         });

//         console.log("✅ Email sent via Resend to:", email);
//     } catch (error) {
//         console.error("❌ Resend Email Error:", error);
//         throw error;
//     }
// };

// module.exports = mailSender;




const SibApiV3Sdk = require('sib-api-v3-sdk');

const mailSender = async (email, title, body) => {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        // API Key setup
        const apiKey = defaultClient.authentications['api-key'];
        // apiKey.apiKey = process.env.MAIL_PASS; // Aapki v3 API Key yahan jayegi
        apiKey.apiKey = process.env.BREVO_API_KEY; // ✅ correct

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        // Email Configuration
        sendSmtpEmail.subject = title;
        sendSmtpEmail.htmlContent = body;
        sendSmtpEmail.sender = { "name": "Study Notion", "email": process.env.MAIL_USER };
        sendSmtpEmail.to = [{ "email": email }];

        // Send call
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log("✅ OTP Sent Successfully:", data.messageId);
        return data;

    } catch (error) {
        // Detailed error for debugging
        console.error("❌ Brevo SDK Error:", error.response ? error.response.body : error.message);
        throw new Error("Email delivery failed");
    }
};

module.exports = mailSender;