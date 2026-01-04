// routes/Section.js
const express = require("express");
const router = express.Router();

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/sectionController");

const { auth, isInstructor } = require("../middleware/auth");

// Create a new section
router.post("/create", auth, isInstructor, createSection);

// Update section
router.put("/update", auth, isInstructor, updateSection);

// Delete section
router.delete("/delete", auth, isInstructor, deleteSection);

module.exports = router;
