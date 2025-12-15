const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const { uploadImageCloudinary } = require("../utils/imageUploader");

// -----------------------------------------------------------------------------------
//  UPDATE PROFILE
// -----------------------------------------------------------------------------------
exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        const userId = req.user.id;

        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "contactNumber and gender are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profile = await Profile.findById(user.additionalDetail);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile,
        });

    } catch (error) {
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
            .populate("additionalDetail")
            .populate("courses") // ✔ YOUR MODEL HAS this field
            .exec();

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch profile details",
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await Course.updateMany(
            { studentEnrolled: userId },
            { $pull: { studentEnrolled: userId } }
        );

        await Profile.findByIdAndDelete(user.additionalDetail);
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// -----------------------------------------------------------------------------------
//  UPDATE PROFILE PICTURE
// -----------------------------------------------------------------------------------
exports.updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageFile = req.files?.profilePicture;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            });
        }

        const uploadedImage = await uploadImageCloudinary(
            imageFile,
            process.env.FOLDER_NAME
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: uploadedImage.secure_url }, // ✔ MATCHED MODEL FIELD
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating profile picture",
            error: error.message,
        });
    }
};
