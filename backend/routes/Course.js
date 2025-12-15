const express = require("express");
const router = express.Router();

// ---------------- Controllers ----------------
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
} = require("../controllers/courseController");

// ---------------- Middlewares ----------------
const { auth, isInstructor, isStudent } = require("../middleware/auth");

// =======================================================
//                 COURSE ROUTES 
// =======================================================

// Create a new course (Only Instructor)
router.post("/courses/create", auth, isInstructor, createCourse);

// Get all published courses
router.get("/courses/all", getAllCourses);

// Get single course details
router.get("/courses/details/:courseId", getCourseDetails);

module.exports = router;
