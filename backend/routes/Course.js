const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileParser"); // adjust path if needed


// ✅ Controllers - Only import what EXISTS
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getInstructorCourses,
    deleteCourse,
    // updateCourse, // ❌ Commented out - doesn't exist yet
} = require("../controllers/courseController");

// Middlewares
const { auth, isInstructor } = require("../middleware/auth");

// ✅ Routes that MATCH your existing controllers
router.post(
    "/createCourse",
    auth,
    isInstructor,
    upload.single("thumbnailImage"), // 🔥 REQUIRED
    createCourse
);

router.get("/allCourses", getAllCourses);
router.get("/getFullCourseDetails/:courseId", getCourseDetails);
router.delete("/:courseId", auth, isInstructor, deleteCourse);  // ✅ FIXED
router.get("/instructor-courses", auth, isInstructor, getInstructorCourses);

module.exports = router;
