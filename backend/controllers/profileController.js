const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");

// -----------------------------------------------------------------------------------
//  UPDATE PROFILE
// -----------------------------------------------------------------------------------
exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        const userId = req.user.id;

        // Required fields
        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "contactNumber and gender are required",
            });
        }

        // Get user
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userDetails.additionalDetail;

        // Get profile
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // Update data
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profileDetails,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// -----------------------------------------------------------------------------------
//  DELETE ACCOUNT
// -----------------------------------------------------------------------------------
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userDetails.additionalDetail;

        // Un-enroll user from all purchased courses
        await Course.updateMany(
            { studentEnrolled: userId },
            { $pull: { studentEnrolled: userId } }
        );

        // Delete Profile
        await Profile.findByIdAndDelete(profileId);

        // Delete User
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        console.error("Delete Account Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// -----------------------------------------------------------------------------------
//  GET FULL PROFILE DETAILS
// -----------------------------------------------------------------------------------
exports.getProfileDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate("additionalDetail")     // Profile
            .populate("purchasedCourses")     // All enrolled courses
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
        console.error("Get Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch profile details",
            error: error.message,
        });
    }
};
