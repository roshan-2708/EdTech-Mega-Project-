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
        const userId = req.user.id;

        let userDetails = await User.findById(userId).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: { path: "subSection" },
            },
        });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        userDetails = userDetails.toObject(); // ✅ ONLY ONCE

        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let totalSubsections = 0;

            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                const subSections = userDetails.courses[i].courseContent[j].subSection;

                totalSubsections += subSections.length;

                totalDurationInSeconds += subSections.reduce(
                    (acc, curr) => acc + Number(curr.timeDuration || 0),
                    0
                );
            }

            userDetails.courses[i].totalDuration =
                convertSecondsToDuration(totalDurationInSeconds);

            const courseProgress = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id, // ✅ FIXED
                userId,
            });

            const completedCount = courseProgress?.completedVideos?.length || 0;

            userDetails.courses[i].progressPercentage =
                totalSubsections === 0
                    ? 100
                    : Math.round((completedCount / totalSubsections) * 10000) / 100;
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });

    } catch (error) {
        console.error("❌ getEnrolledCourses error:", error);
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
            const totalStudentsEnrolled = course.studentEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course.id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            console.log("data print", courseDataWithStats);

            return courseDataWithStats
        });

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}