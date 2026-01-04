const express = require("express");
const router = express.Router();

const upload = require("../middleware/fileParser"); // ✅ multer
const {
    updateProfile,
    deleteAccount,
    getProfileDetails,
    updateProfilePicture,
    getEnrolledCourses
} = require("../controllers/profileController");

const { auth } = require("../middleware/auth");

router.put("/update-profile", auth, updateProfile);

// ✅ FIXED ROUTE (THIS IS THE KEY LINE)
router.put(
  "/update-display-picture",
  auth,                         // 1️⃣ auth
  upload.single("profilePicture"), // 2️⃣ multer
  updateProfilePicture          // 3️⃣ controller
);



router.delete("/delete-account", auth, deleteAccount);
router.get("/get-user-details", auth, getProfileDetails);
router.get("/get-enrolled-courses", auth, getEnrolledCourses);

module.exports = router;
