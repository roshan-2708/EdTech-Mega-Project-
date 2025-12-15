const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { resetPasswordTemplate } = require("../mail/templates/resetPasswordTemplate");
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Email required
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Email is not registered.",
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Save token + expiry
        await User.findOneAndUpdate(
            { email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 min
            },
            { new: true }
        );

        // Reset URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail
        await mailSender(
            email,
            "Reset Your Password",
            resetPasswordTemplate(resetUrl, user.firstName)
        );

        return res.status(200).json({
            success: true,
            message: "Reset password email sent successfully.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error sending reset password link.",
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // Find user via token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        // Check expiry
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired. Please request a new reset link.",
            });
        }

        // Hash new password
        const hashed = await bcrypt.hash(password, 10);

        // Update password + clear token
        await User.findOneAndUpdate(
            { token },
            {
                password: hashed,
                token: null,
                resetPasswordExpires: null,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in resetting password.",
        });
    }
};
