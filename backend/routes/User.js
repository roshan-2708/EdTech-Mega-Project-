const express = require("express");
const router = express.Router();

const userController = require("../controllers/Auth");
const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword");

const { auth } = require("../middleware/auth");

// OTP
router.post("/send-otp", userController.sendOtp);

// verify otp
router.post("/verify-otp", userController.verifyOtp);

// Signup
router.post("/signup", userController.signUp);

// Login
router.post("/login", userController.login);

// Logout route
router.post("/logout", userController.logout);

// Change password
router.put("/change-password", auth, userController.changePassword);

// Forgot-password flow
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// ✅ CORRECT - Import from profileController
const profileController = require("../controllers/profileController");
// Update the route
router.delete("/delete-account", auth, profileController.deleteAccount);

// Get full profile
router.get("/profile", auth, async (req, res) => {
    try {
        const User = require("../model/User");

        const user = await User.findById(req.user.id)
            .populate("additionalDetail")
            .populate("courses")
            .populate("courseProgress");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({ success: true, user });

    } catch (err) {
        console.error("PROFILE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
});

module.exports = router;
