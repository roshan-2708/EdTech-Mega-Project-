const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getProfileDetails,
    updateProfilePicture,
    getEnrolledCourses
} = require("../controllers/profileController");

const { auth } = require("../middleware/auth");

router.put("/update-profile", auth, updateProfile);
router.put("/update-display-picture", auth, updateProfilePicture);
router.delete("/delete-account", auth, deleteAccount);
router.get("/get-user-details", auth, getProfileDetails);
router.get("/get-enrolled-courses", auth, getEnrolledCourses);
module.exports = router;
