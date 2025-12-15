const Category = require("../model/Category");
const Course = require("../model/Course");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required."
            });
        }

        // Check if category exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists."
            });
        }

        // Create category
        const newCategory = await Category.create({ name, description });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: newCategory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: 1, description: 1 });

        return res.status(200).json({
            success: true,
            message: "All categories retrieved successfully.",
            data: allCategories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET CATEGORY PAGE DETAILS
exports.CategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required."
            });
        }

        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: { path: "instructor", select: "firstName lastName email" }
            })
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        const otherCategories = await Category.find({ _id: { $ne: categoryId } })
            .populate({
                path: "courses",
                match: { status: "Published" }
            })
            .exec();

        const topSellingCourses = await Course.find({ status: "Published" })
            .sort({ studentEnrolled: -1 })
            .limit(10)
            .populate("instructor category")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Category page data fetched successfully.",
            data: { selectedCategory, otherCategories, topSellingCourses }
        });

    } catch (error) {
        console.error("CategoryPageDetails Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};
