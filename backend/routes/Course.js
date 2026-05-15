const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileParser"); 

// ✅ Controllers - Only import what EXISTS
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse,
    editCourseDetails
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

router.put(
    "/editCourse",
    auth,
    isInstructor,
    upload.none(),  // parses formData fields without expecting a file
    editCourseDetails
);

router.get("/allCourses", getAllCourses);
router.get("/getCourseDetails/:courseId", getCourseDetails);
router.delete("/:courseId", auth, isInstructor, deleteCourse);
router.get("/instructor-courses", auth, isInstructor, getInstructorCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
module.exports = router;
