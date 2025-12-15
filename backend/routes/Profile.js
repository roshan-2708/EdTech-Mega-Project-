const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getProfileDetails
} = require("../controllers/profileController");

// Middlewares
const { auth } = require("../middleware/auth");

// ---------------- PROFILE ROUTES ----------------

// 1️⃣ Update Profile
router.put("/update-profile", auth, updateProfile);

// 2️⃣ Delete Account
router.delete("/delete-account", auth, deleteAccount);

// 3️⃣ Get Full Profile Details
router.get("/get-user-details", auth, getProfileDetails);

module.exports = router;
