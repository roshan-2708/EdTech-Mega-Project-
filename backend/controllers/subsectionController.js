const SubSection = require("../model/SubSection");
const Course = require("../model/Course");
const Section = require("../model/Section");
const { uploadFileCloudinary } = require("../utils/imageUploader");

// ---------------- CREATE SUBSECTION ----------------
exports.createSubSection = async (req, res) => {
    try {
        const { title, timeDuration, description, sectionId, courseId } = req.body;
        const videoFile = req.files?.video;

        // Validation
        if (!title || !timeDuration || !description || !sectionId || !courseId || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Upload video to Cloudinary
        const video = await uploadFileCloudinary(videoFile, process.env.FOLDER_NAME, "video");

        // Create SubSection
        const newSubSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: video.secure_url,
        });

        // Push SubSection into Section
        await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: newSubSection._id } },
            { new: true }
        );

        // Populate updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "SubSection created successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Create SubSection Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create subsection.",
            error: error.message,
        });
    }
};

// ---------------- UPDATE SUBSECTION ----------------
exports.updateSubSection = async (req, res) => {
    try {
        const { subsectionId, sectionId, title, timeDuration, description, courseId } = req.body;

        if (!subsectionId) {
            return res.status(400).json({
                success: false,
                message: "subsectionId is required.",
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (timeDuration) updateData.timeDuration = timeDuration;
        if (description) updateData.description = description;

        // Upload new video if provided
        if (req.files?.video) {
            const video = await uploadFileCloudinary(req.files.video, process.env.FOLDER_NAME, "video");
            updateData.videoUrl = video.secure_url;
        }

        // Update SubSection
        await SubSection.findByIdAndUpdate(subsectionId, updateData, { new: true });

        // Populate updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Update SubSection Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update subsection.",
            error: error.message,
        });
    }
};

// ---------------- DELETE SUBSECTION ----------------
exports.deleteSubSection = async (req, res) => {
    try {
        const { subsectionId, sectionId, courseId } = req.body;

        if (!subsectionId || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "subsectionId, sectionId, and courseId are required.",
            });
        }

        // Remove from Section
        await Section.findByIdAndUpdate(sectionId, { $pull: { subSection: subsectionId } });

        // Delete the SubSection
        await SubSection.findByIdAndDelete(subsectionId);

        // Populate updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Delete SubSection Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete subsection.",
            error: error.message,
        });
    }
};
