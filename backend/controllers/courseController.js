// controllers/courseController.js
const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const { uploadImageCloudinary } = require("../utils/fileUploader");
const mongoose = require("mongoose");


// create course
exports.createCourse = async (req, res) => {
    try {
        console.log("RAW req.body:", req.body);
        console.log("req.files:", req.files);

        const {
            courseName,
            courseDescription,
            price: coursePrice,
            tag: courseTags,
            whatYouWillLearn: courseBenefits,
            category: courseCategory,
            status = "Draft",
        } = req.body;

        // ----------------------------
        // Validation
        // ----------------------------
        const isEmpty = (val) =>
            val === undefined ||
            val === null ||
            (typeof val === "string" && val.trim() === "");

        if (
            isEmpty(courseName) ||
            isEmpty(courseDescription) ||
            isEmpty(coursePrice) ||
            isEmpty(courseCategory)
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                missing: {
                    courseName: isEmpty(courseName),
                    courseDescription: isEmpty(courseDescription),
                    price: isEmpty(coursePrice),
                    category: isEmpty(courseCategory),
                },
            });
        }

        // ----------------------------
        // Check Instructor
        // ----------------------------
        const userId = req.user.id;
        const instructor = await User.findById(userId);
        if (!instructor || instructor.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Instructor only",
            });
        }

        // ----------------------------
        // Check Category
        // ----------------------------
        const categoryDoc = await Category.findById(courseCategory);
        if (!categoryDoc) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        
        let thumbnailUrl =
            "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Course+Thumbnail";

        if (req.file) {
            const uploadedThumbnail = await uploadImageCloudinary(
                req.file.path,
                process.env.FOLDER_NAME || "courses"
            );
            thumbnailUrl = uploadedThumbnail.secure_url;
        }



        
        const newCourse = await Course.create({
            courseName: courseName.trim(),
            courseDescription: courseDescription.trim(),
            courseDuration: 30, // default duration
            whatYouWillLearn: courseBenefits || "",
            price: Number(coursePrice),
            tag: courseTags ? courseTags.split(",").map((t) => t.trim()) : [],
            instructor: instructor._id,
            category: categoryDoc._id,
            thumbnail: thumbnailUrl,
            status,
            courseContent: [],
        });

        
        await User.findByIdAndUpdate(instructor._id, {
            $push: { courses: newCourse._id },
        });

        await Category.findByIdAndUpdate(courseCategory, {
            $push: { courses: newCourse._id },
        });

        
        return res.status(201).json({
            success: true,
            message: "Course created successfully!",
            data: newCourse,
        });
    } catch (error) {
        console.error("❌ CreateCourse error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate("instructor")
            .populate("category");

        return res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error("Get All Courses Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get single course details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res
                .status(400)
                .json({ success: false, message: "Course ID is required" });
        }

        const course = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: { path: "additionalDetail" },
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            });

        if (!course) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: course,
        });
    } catch (error) {
        console.error("Get Course Details Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get instructor courses
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const instructor = await User.findById(instructorId);
        if (!instructor || instructor.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can access this",
            });
        }

        const courses = await Course.find({ instructor: instructorId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params; // ✅ FIXED

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        const course = await Course.findById(courseId).populate(
            "instructor",
            "accountType"
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const userId = req.user.id;
        if (
            course.instructor._id.toString() !== userId &&
            req.user.role !== "Admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only course instructor or admin can delete",
            });
        }

        await User.findByIdAndUpdate(course.instructor._id, {
            $pull: { courses: courseId },
        });

        await Category.findByIdAndUpdate(course.category, {
            $pull: { courses: courseId },
        });

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully!",
        });
    } catch (error) {
        console.error("❌ DeleteCourse error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.editCourseDetails = async (req, res) => {
    try {
        console.log("EDIT req.body:", req.body);
        console.log("EDIT req.file:", req.file);

        const {
            courseId,
            courseName,
            courseDescription,
            price,
            tag,
            whatYouWillLearn,
            category,
            status,
        } = req.body;

        // ----------------------------
        // Validation
        // ----------------------------
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        // ----------------------------
        // Find Course
        // ----------------------------
        const course = await Course.findById(courseId).populate("instructor");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // ----------------------------
        // Authorization
        // ----------------------------
        if (course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this course",
            });
        }

        // ----------------------------
        // Update Fields (ONLY if sent)
        // ----------------------------
        if (courseName !== undefined) {
            course.courseName = courseName.trim();
        }

        if (courseDescription !== undefined) {
            course.courseDescription = courseDescription.trim();
        }

        if (price !== undefined) {
            course.price = Number(price);
        }

        if (whatYouWillLearn !== undefined) {
            course.whatYouWillLearn = whatYouWillLearn;
        }

        if (tag !== undefined) {
            course.tag = tag.split(",").map((t) => t.trim());
        }

        if (status !== undefined) {
            course.status = status;
        }

        // ----------------------------
        // Category update (if changed)
        // ----------------------------
        if (category !== undefined) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category",
                });
            }
            course.category = category;
        }

        // ----------------------------
        // Thumbnail update (OPTIONAL)
        // ----------------------------
        if (req.file) {
            const uploadedThumbnail = await uploadImageCloudinary(
                req.file.path,
                process.env.FOLDER_NAME || "courses"
            );
            course.thumbnail = uploadedThumbnail.secure_url;
        }

        // ----------------------------
        // Save Course
        // ----------------------------
        const updatedCourse = await course.save();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });

    } catch (error) {
        console.error("❌ EditCourse error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
