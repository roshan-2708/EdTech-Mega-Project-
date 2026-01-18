const express = require("express");
const router = express.Router();

const upload = require("../middleware/fileParser"); // ✅ multer
const {
  updateProfile,
  deleteAccount,
  getProfileDetails,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/profileController");

const { auth, isInstructor } = require("../middleware/auth");

router.put("/update-profile", auth, updateProfile);

router.put(
  "/update-display-picture",
  auth,
  upload.single("profilePicture"),
  updateProfilePicture
);



router.delete("/delete-account", auth, deleteAccount);
router.get("/get-user-details", auth, getProfileDetails);
router.get("/get-enrolled-courses", auth, getEnrolledCourses);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
