// controllers/subsectionController.js
const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const Course = require("../model/Course");
const { uploadFileCloudinary } = require("../utils/fileUploader");




exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, description, timeDuration, courseId } = req.body;

        // 1️⃣ Basic validation
        if (!sectionId || !title || !courseId) {
            return res.status(400).json({
                success: false,
                message: "sectionId, title, and courseId are required",
            });
        }

        // 2️⃣ Find section and ensure it has a courseId
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        // Ensure section.courseId exists (in case of old data)
        if (!section.courseId) {
            section.courseId = courseId;
            await section.save();
        }

        // 3️⃣ Get the course to check ownership
        const course = await Course.findById(section.courseId).populate("instructor");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // 4️⃣ Parse timeDuration "MM:SS" → seconds
        let durationInSeconds = 0;
        if (timeDuration) {
            const [minutes, seconds] = timeDuration.split(":").map(Number);
            if (isNaN(minutes) || isNaN(seconds)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid timeDuration format (MM:SS)",
                });
            }
            durationInSeconds = minutes * 60 + seconds;
        }

        // 5️⃣ Upload video if provided
        let videoUrl = "";
        if (req.file) {
            const uploadedVideo = await uploadFileCloudinary(
                req.file.buffer,
                process.env.FOLDER_NAME || "course-videos",
                "video"
            );
            videoUrl = uploadedVideo.secure_url;
        }

        // 6️⃣ Create new subsection
        const newSubSection = await SubSection.create({
            sectionId: section._id,
            courseId: section.courseId,
            title,
            description: description || "",
            timeDuration: durationInSeconds,
            videoUrl,
        });

        // 7️⃣ Add reference to section
        section.subSection.push(newSubSection._id);
        await section.save();

        // 8️⃣ Return updated course with populated sections/subsections
        const updatedCourse = await Course.findById(course._id)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            })
            .populate("category")
            .populate("instructor");

        return res.status(201).json({
            success: true,
            message: "Lecture created successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("❌ Create SubSection Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Update SubSection
exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId, title, timeDuration, description, courseId } =
            req.body;

        if (!subSectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId and courseId are required",
            });
        }

        // Ownership check
        const course = await Course.findById(courseId).populate("instructor");
        if (!course || course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        // Handle timeDuration update
        if (timeDuration !== undefined) {
            const [minutes, seconds] = timeDuration.split(":").map(Number);
            if (isNaN(minutes) || isNaN(seconds)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid timeDuration format (use MM:SS)",
                });
            }
            updateData.timeDuration = minutes * 60 + seconds;
        }

        // Upload new video if provided (optional)
        if (req.file) {
            const uploadedVideo = await uploadFileCloudinary(
                req.file.buffer,
                process.env.FOLDER_NAME || "course-videos",
                "video"
            );
            updateData.videoUrl = uploadedVideo.secure_url;
        }

        // Update SubSection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            updateData,
            { new: true }
        );

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("❌ Update SubSection Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update subsection",
            error: error.message,
        });
    }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId, courseId } = req.body;

        if (!subSectionId || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId, sectionId, and courseId are required",
            });
        }

        // Ownership check
        const course = await Course.findById(courseId).populate("instructor");
        if (!course || course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // Remove from Section.subSection array
        await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSection: subSectionId },
        });

        // Delete SubSection document
        await SubSection.findByIdAndDelete(subSectionId);

        // Return updated course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("❌ Delete SubSection Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete subsection",
            error: error.message,
        });
    }
};
