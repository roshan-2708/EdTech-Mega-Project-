const express = require("express");
const router = express.Router();

const {
    createRating,
    getAverageRating,
    getAllRatings,
} = require("../controllers/raingAndReviewController");

const { auth, isStudent } = require("../middleware/auth");


router.post("/create", auth, isStudent, createRating);


router.post("/average", getAverageRating);

router.get("/all", getAllRatings);

module.exports = router;
