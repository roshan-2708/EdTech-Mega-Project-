const express = require("express");
const router = express.Router();
const userController = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
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


module.exports = router;
