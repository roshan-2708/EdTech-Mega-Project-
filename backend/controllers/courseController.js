const Course = require("../model/Course");
const Category = require("../model/Category");
const User = require("../model/User");
const { uploadImageCloudinary } = require("../utils/imageUploader");

// ---------------- CREATE COURSE ----------------
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, categoryId } = req.body;
        const thumbnail = req.files?.thumbnailImage;

        // Validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !categoryId || !thumbnail) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Instructor validation
        const userId = req.user.id;
        const instructor = await User.findById(userId);
        if (!instructor || instructor.accountType !== "Instructor") {
            return res.status(403).json({ success: false, message: "Only instructors can create courses." });
        }

        // Category validation
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ success: false, message: "Invalid category!" });
        }

        // Upload thumbnail
        const uploadedThumbnail = await uploadImageCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructor._id,
            whatYouWillLearn,
            price,
            category: category._id,
            thumbnail: uploadedThumbnail.secure_url,
        });

        // Add course to instructor
        await User.findByIdAndUpdate(instructor._id, { $push: { courses: newCourse._id } }, { new: true });

        // Add course to category
        await Category.findByIdAndUpdate(categoryId, { $push: { courses: newCourse._id } }, { new: true });

        return res.status(201).json({ success: true, message: "Course created successfully.", data: newCourse });

    } catch (error) {
        console.error("Create Course Error:", error);
        return res.status(500).json({ success: false, message: error.message });
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
