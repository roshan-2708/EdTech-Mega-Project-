const express = require("express");
const router = express.Router();

const { updateCourseProgress } = require("../controllers/courseProgressController");
const { auth, isStudent } = require("../middleware/auth");

router.post("/update", auth, isStudent, updateCourseProgress);

module.exports = router;
