const express = require("express");
const router = express.Router();

const {
    createRating,
    getAverageRating,
    getAllRatings,
} = require("../controllers/raingAndReviewController");

const { auth, isStudent } = require("../middleware/auth");

// ⭐ Create rating
router.post("/create", auth, isStudent, createRating);

// ⭐ Get average rating of a course
router.post("/average", getAverageRating);

// ⭐ Get all ratings
router.get("/all", getAllRatings);

module.exports = router;
