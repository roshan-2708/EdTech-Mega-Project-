const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require("../controllers/Auth");
const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword");
const jwt = require("jsonwebtoken"); // <-- YEH LINE TOP PAR ADD KARO

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


/**
 * @desc    Google Login trigger (Ispe click karte hi Google Dialog box khulega)
 * @route   GET /api/auth/google
 */

/**
 * @desc    Google Callback (Google login ke baad yahan data bhejega)
 * @route   GET /api/auth/google/callback
 */

router.get(
    '/google',
    (req, res, next) => {
        // URL se Student/Instructor nikal kar passport ki state me daal rahe hain
        const accountType = req.query.type || 'Student'; 
        passport.authenticate('google', { 
            scope: ['profile', 'email'],
            state: accountType // <--- Yeh state callback me wapas milegi
        })(req, res, next);
    }
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: 'https://ed-tech-mega-project.vercel.app/?error=login_failed' }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect("https://ed-tech-mega-project.vercel.app/?error=no_user");
            }

            
            const payload = {
                email: req.user.email,
                id: req.user._id,
                role: req.user.accountType, 
            };

            const authToken = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            
            req.user.activeToken = authToken;
            await req.user.save();

            
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true, 
                sameSite: 'none'
            };
            res.cookie("token", authToken, options);

            
            const frontendURL = "https://ed-tech-mega-project.vercel.app/auth-success";
            return res.redirect(`${frontendURL}?token=${authToken}`);

        } catch (error) {
            console.error("JWT Generation Error:", error);
            return res.redirect("https://ed-tech-mega-project.vercel.app/?error=server_error");
        }
    }
);

module.exports = router;
