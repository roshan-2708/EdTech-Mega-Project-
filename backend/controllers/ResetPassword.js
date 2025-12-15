const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { resetPasswordTemplate } = require("../mail/template/resetPasswordTemplate");

// -----------------------------------------------------------
//  SEND RESET PASSWORD EMAIL (GENERATE TOKEN)
// -----------------------------------------------------------
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered",
            });
        }

        // Generate unique token
        const token = crypto.randomUUID();

        // Save token + expiry in DB
        await User.findOneAndUpdate(
            { email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 mins
            },
            { new: true }
        );

        // Correct reset URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send email
        await mailSender(
            email,
            "Reset Your Password",
            resetPasswordTemplate(url, user.firstName)
        );

        return res.status(200).json({
            success: true,
            message: "Reset password link sent to your email",
        });

    } catch (error) {
        console.error("Reset Password Token Error:", error);
        return res.status(500).json({
            success: false,
            message: "Could not send reset password email",
        });
    }
};




// -----------------------------------------------------------
//  RESET PASSWORD USING TOKEN
// -----------------------------------------------------------
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Validate
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Find user with token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Check expiry
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired. Please request a new link.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password + clear token
        await User.findOneAndUpdate(
            { token },
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpires: null,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
