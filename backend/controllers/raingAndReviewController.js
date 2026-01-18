const RatingAndReview = require("../model/RatingAndReview");
const Course = require("../model/Course");
const mongoose = require("mongoose");


exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;   // FIXED
        const { courseId, rating, review } = req.body;

        // validation
        if (!courseId || !rating) {
            return res.status(400).json({
                success: false,
                message: "CourseId and rating are required.",
            });
        }

        // check if course exists
        const courseData = await Course.findById(courseId);
        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // check user enrolled
        if (!courseData.studentEnrolled.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "User is not enrolled in this course",
            });
        }

        // check already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        }

        // create rating
        const ratingReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review,
        });

        // add rating to course
        courseData.ratingAndReview.push(ratingReview._id);
        await courseData.save();

        return res.status(201).json({
            success: true,
            message: "Rating added successfully",
            data: ratingReview,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body.courseId

        // Calculate the average rating using the MongoDB aggregation pipeline
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId), // Convert courseId to ObjectId
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ])

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // If no ratings are found, return 0 as the default rating
        return res.status(200).json({ success: true, averageRating: 0 })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating for the course",
            error: error.message,
        })
    }
}


exports.getAllRatings = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
            })
            .populate({
                path: "course",
                select: "courseName", //Specify the fields you want to populate from the "Course" model
            })
            .exec()

        res.status(200).json({
            success: true,
            data: allReviews,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating and review for the course",
            error: error.message,
        })
    }
};
