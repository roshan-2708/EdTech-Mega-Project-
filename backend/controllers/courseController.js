const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const { uploadImageCloudinary } = require("../utils/fileUploader");

exports.createCourse = async (req, res) => {
    try {
        // ✅ DEBUG logs
        console.log("RAW req.body:", req.body);
        console.log("req.files:", req.files);

        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is empty. Use form-data format."
            });
        }

        const {
            courseName,
            courseDescription,
            courseDuration,
            whatYouWillLearn,
            price,
            categoryId,
            status,
            tag  // Added from your form
        } = req.body;

        const thumbnail = req.files?.thumbnailImage;

        // ✅ Validation
        if (!courseName || !courseDescription || !courseDuration || !whatYouWillLearn || !price || !categoryId) {
            return res.status(400).json({
                success: false,
                message: `Missing: courseName(${courseName}), price(${price}), categoryId(${categoryId})`
            });
        }

        if (!thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image required!"
            });
        }

        if (!thumbnail.mimetype.startsWith("image/")) {
            return res.status(400).json({
                success: false,
                message: "Only image files allowed"
            });
        }

        // ✅ Auth check
        const userId = req.user.id;
        const instructor = await User.findById(userId);
        if (!instructor || instructor.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Instructor access only"
            });
        }

        // ✅ Category check
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        // ✅ 🔥 CLOUDINARY - Direct path (matches your fileUploader)
        console.log("📤 Uploading:", thumbnail.tempFilePath);
        const uploadedThumbnail = await uploadImageCloudinary(
            thumbnail.tempFilePath,        // ✅ STRING path
            process.env.FOLDER_NAME,       // folder
            "image",                       // type
            1000,                          // height
            80                             // quality
        );

        const courseStatus = status === "Published" ? "Published" : "Draft";

        // ✅ Create course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            courseDuration,
            whatYouWillLearn,
            price: Number(price),
            tag: tag || [],                // From your form
            instructor: instructor._id,
            category: category._id,
            thumbnail: uploadedThumbnail.secure_url,
            status: courseStatus,
        });

        // ✅ Update relationships
        await User.findByIdAndUpdate(instructor._id, {
            $push: { courses: newCourse._id }
        });
        await Category.findByIdAndUpdate(categoryId, {
            $push: { courses: newCourse._id }
        });

        console.log("✅ Course created:", newCourse._id);

        return res.status(201).json({
            success: true,
            message: "Course created successfully!",
            data: newCourse
        });

    } catch (error) {
        console.error("❌ CREATE COURSE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// ---------------- GET ALL COURSES ----------------
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

// ---------------- GET SINGLE COURSE DETAILS ----------------
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const course = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: { path: "additionalDetail" }
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" }
            });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course fetched successfully", data: course });

    } catch (error) {
        console.error("Get Course Details Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------- GET INSTRUCTOR COURSES ----------------
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

        const courses = await Course.find({ instructor: instructorId })
            .sort({ createdAt: -1 });

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
