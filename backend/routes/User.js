const express = require("express");
const router = express.Router();

// Controllers
const userController = require("../controllers/Auth");

// Middleware
const { auth } = require("../middleware/auth");

// ---------------- OTP ----------------
router.post("/send-otp", userController.sendOtp);

// ---------------- SIGNUP ----------------
router.post("/signup", userController.signUp);

// ---------------- LOGIN ----------------
router.post("/login", userController.login);

// ---------------- CHANGE PASSWORD ----------------
router.put("/change-password", auth, userController.changePassword);

// ---------------- GET USER PROFILE ----------------
router.get("/profile", auth, async (req, res) => {
    try {
        const User = require("../model/User");
        
        const user = await User.findById(req.user.id)
            .populate("additionalDetail")
            .populate("courses")
            .populate("coursesProgress");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
});

module.exports = router;
