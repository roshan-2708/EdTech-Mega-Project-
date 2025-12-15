const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { auth, isAdmin } = require("../middleware/auth");

// CREATE CATEGORY (Admin only)
router.post("/create", auth, isAdmin, categoryController.createCategory);

// GET ALL CATEGORIES
router.get("/all", categoryController.getAllCategories);

// CATEGORY PAGE DETAILS
router.post("/details", categoryController.CategoryPageDetails);

module.exports = router;
