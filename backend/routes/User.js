const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

// ── existing routes (unchanged) ──────────────────────────────
router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.put("/change-password", auth, userController.changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

const profileController = require("../controllers/profileController");
router.delete("/delete-account", auth, profileController.deleteAccount);

router.get("/profile", auth, async (req, res) => {
    try {
        const User = require("../model/User");
        const user = await User.findById(req.user.id)
            .populate("additionalDetail")
            .populate("courses")
            .populate("courseProgress");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("PROFILE ERROR:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
});

// ── Google OAuth routes (fixed) ───────────────────────────────

// Step 1: frontend calls this BEFORE opening Google to save the role
router.post("/set-role", (req, res) => {
    const { role } = req.body;
    if (!["Student", "Instructor"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }
    req.session.pending_role = role;
    res.json({ ok: true });
});

// Step 2: opens Google login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 3: Google redirects back here after login
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/?error=login_failed`,
        session: true,           // must be true so pending_role session works
    }),
    async (req, res) => {
        try {
            const user = req.user;

            const token = jwt.sign(
                { email: user.email, id: user._id, role: user.accountType },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            user.activeToken = token;
            await user.save();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            // redirect to frontend with token + role
            return res.redirect(
                `${process.env.FRONTEND_URL}/auth/callback?token=${token}&role=${user.accountType}`
            );
        } catch (err) {
            console.error("Google callback error:", err);
            return res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`);
        }
    }
);

module.exports = router;