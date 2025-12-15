const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // 5 minutes
        },
    }
);

// Email sending function
async function sendVerificationEmail(email, otp) {
    await mailSender(
        email,
        "Verification Email - StudyNotion",
        `<h1>Your OTP is: ${otp}</h1><p>Valid for 5 minutes</p>`
    );
}

// Send email ONLY when new OTP is created
otpSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model("Otp", otpSchema);
