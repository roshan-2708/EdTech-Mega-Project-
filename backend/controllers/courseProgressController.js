const CourseProgress = require("../model/CourseProgress");
const SubSection = require("../model/SubSection");

exports.updateCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, subSectionId } = req.body;

        if (!courseId || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: "courseId and subSectionId are required",
            });
        }

        // ✅ validate subsection
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Invalid subsection",
            });
        }

        // ✅ find existing progress
        let courseProgress = await CourseProgress.findOne({
            userId : userId,
            courseId : courseId,
        });

        // ✅ create if not exists
        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                userId,
                courseId,
                completedVideos: [subSectionId],
            });
        } else {
            // ✅ prevent duplicate push
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(200).json({
                    success: true,
                    message: "Lecture already completed",
                    data: courseProgress,
                });
            }

            courseProgress.completedVideos.push(subSectionId);
            await courseProgress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture marked as complete",
            data: courseProgress,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
