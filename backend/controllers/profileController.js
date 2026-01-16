const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const { uploadImageCloudinary } = require("../utils/fileUploader");
const CourseProgress = require("../model/CourseProgress");
const convertSecondsToDuration = require("../utils/convertSecondsToDuration");

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        const userId = req.user.id;

        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "contactNumber and gender are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Handle profile
        let profile = await Profile.findById(user.additionalDetail);
        if (!profile) {
            profile = new Profile({
                user: userId,
                dateOfBirth,
                about,
                gender,
                contactNumber,
            });
        } else {
            profile.dateOfBirth = dateOfBirth;
            profile.about = about;
            profile.gender = gender;
            profile.contactNumber = contactNumber;
        }
        await profile.save();

        // Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        // ✅ CLOUDINARY UPLOAD (if image provided)
        if (req.file) {
            const uploadedImage = await uploadImageCloudinary(
                req.file,
                "profile_pictures"
            );
            user.image = uploadedImage.secure_url;
        }

        await user.save();

        const updatedUser = await User.findById(userId).populate("additionalDetail");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageFile = req.file; // ✅ From frontend FormData

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required"
            });
        }

        // ✅ Use YOUR Cloudinary uploader
        const uploadedImage = await uploadImageCloudinary(
            imageFile.path,   // 👈 STRING path
            "profile_pictures"
        );


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: uploadedImage.secure_url },
            { new: true }
        ).populate("additionalDetail");

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("UPDATE PICTURE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProfileDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate("additionalDetail")
            .populate("courses")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch profile details",
            error: error.message,
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. ✅ Find user first
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 2. ✅ Clean up enrolled courses (remove user from studentEnrolled arrays)
        await Course.updateMany(
            { studentEnrolled: userId },
            { $pull: { studentEnrolled: userId } }
        );

        // 3. ✅ Delete user's created courses (if instructor)
        await Course.deleteMany({ instructor: userId });

        // 4. ✅ Delete profile details
        if (user.additionalDetail) {
            await Profile.findByIdAndDelete(user.additionalDetail);
        }

        // 5. ✅ Clean up any other references (optional)
        // Remove user from other users' followers/following if you have social features
        // await User.updateMany(
        //     { following: userId },
        //     { $pull: { following: userId } }
        // );

        // 6. ✅ Delete user permanently
        await User.findByIdAndDelete(userId);

        // 7. ✅ Clear auth tokens (Frontend should handle logout)
        return res.status(200).json({
            success: true,
            message: "Account & all associated data deleted permanently",
        });

    } catch (error) {
        console.error("DELETE ACCOUNT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete account",
            error: error.message,
        });
    }
};


exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user?.id; // Auth middleware should set req.user

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user not authenticated",
            });
        }

        // Fetch user with populated courses, content, and subSections
        let userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Convert to plain object for modification
        userDetails = userDetails.toObject();

        const courses = userDetails.courses || [];

        // Loop over each course to calculate total duration and progress
        for (let i = 0; i < courses.length; i++) {
            let totalDurationInSeconds = 0;
            let subSectionCount = 0;

            const course = courses[i];

            if (course.courseContent && course.courseContent.length > 0) {
                for (let j = 0; j < course.courseContent.length; j++) {
                    const content = course.courseContent[j];

                    // Sum up total duration of all subSections safely
                    const contentSubSections = content.subSection || [];
                    totalDurationInSeconds += contentSubSections.reduce(
                        (acc, curr) => acc + parseInt(curr.timeDuration || 0),
                        0
                    );

                    subSectionCount += contentSubSections.length;
                }
            }

            // Convert total seconds to readable duration
            course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            // Fetch user progress for this course
            let courseProgress = await CourseProgress.findOne({
                courseID: course._id,
                userId: userId,
            });

            const completedVideos = courseProgress?.completedVideos?.length || 0;

            // Calculate progress percentage
            course.progressPercentage =
                subSectionCount === 0
                    ? 100
                    : Math.round((completedVideos / subSectionCount) * 100 * 100) / 100; // 2 decimal points
        }

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        console.error("Error in getEnrolledCourses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
            error: error.message,
        });
    }
};

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnroled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}