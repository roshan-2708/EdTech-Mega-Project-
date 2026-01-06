// controllers/sectionController.js
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const Course = require("../model/Course");

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: `Missing: sectionName(${sectionName}), courseId(${courseId})`,
            });
        }

        // Course exists + ownership check
        const course = await Course.findById(courseId).populate("instructor");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this course",
            });
        }

        // Create section
        const newSection = await Section.create({
            sectionName,
            courseId,
        });

        // Add to course.courseContent
        course.courseContent.push(newSection._id);
        await course.save();

        // Populate full course
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                model: "Section",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "Section created successfully!",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Create Section Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;

        // ✅ 1. Validate inputs FIRST
        if (!sectionName || !sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "sectionName, sectionId, and courseId are required.",
            });
        }

        // ✅ 2. Find course
        const course = await Course.findById(courseId).populate("instructor");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // ✅ 3. Authorization check
        if (course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // ✅ 4. Section exists?
        const sectionExists = await Section.findById(sectionId);
        if (!sectionExists) {
            return res.status(404).json({
                success: false,
                message: "Section not found.",
            });
        }

        // ✅ 5. Update section
        await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // ✅ 6. Return updated course
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
            message: "Section updated successfully.",
            data: updatedCourse,
        });

    } catch (error) {
        console.error("Update Section Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update section.",
            error: error.message,
        });
    }
};


exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        if (!sectionId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "sectionId and courseId are required.",
            });
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found.",
            });
        }

        // Delete all subsections
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        // Delete section
        await Section.findByIdAndDelete(sectionId);

        // Remove section from course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: { courseContent: sectionId },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("category")
            .populate("instructor");

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Delete Section Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete section.",
            error: error.message,
        });
    }
};
