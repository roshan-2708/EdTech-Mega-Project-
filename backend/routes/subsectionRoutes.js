const express = require("express");
const router = express.Router();

// Controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/subsectionController");

// Middlewares
const { auth, isInstructor } = require("../middleware/auth");

// =======================================================
//                 SUB-SECTION ROUTES
// =======================================================

// Create SubSection (Instructor only)
router.post("/sub/create", auth, isInstructor, createSubSection);

// Update SubSection (Instructor only)
router.put("/subsection/update", auth, isInstructor, updateSubSection);

// Delete SubSection (Instructor only)
router.delete("/subsection/delete", auth, isInstructor, deleteSubSection);

module.exports = router;
