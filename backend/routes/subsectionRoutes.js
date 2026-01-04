// routes/subSectionRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/subsectionController");

// Middleware
const { auth, isInstructor } = require("../middleware/auth");

// Multer config (memory storage for Cloudinary upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Create SubSection
router.post(
    "/createSubSection",
    auth,
    isInstructor,
    upload.single("video"), // req.file
    createSubSection
);

// Update SubSection
router.put(
    "/updateSubSection",
    auth,
    isInstructor,
    upload.single("video"), // optional video
    updateSubSection
);

// Delete SubSection
router.delete(
    "/deleteSubSection",
    auth,
    isInstructor,
    deleteSubSection
);

module.exports = router;
