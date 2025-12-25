const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const { uploadFileCloudinary } = require("../utils/fileUploader");
const mongoose = require("mongoose");
// -----------------------------------------------------------------------------------
//  UPDATE PROFILE
// -----------------------------------------------------------------------------------
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
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const profile = await Profile.findById(user.additionalDetail);
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        // Update profile fields
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;
        await profile.save();

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        if (req.file) {
            user.image = req.file.path; // save file path or cloud URL
        }

        await user.save();

        // Return updated user
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: await User.findById(userId).populate("additionalDetail"), // populate profile details
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
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

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Clean up courses first
        await Course.updateMany(
            { studentEnrolled: userId },
            { $pull: { studentEnrolled: userId } }
        );

        // Delete profile if exists
        if (user.additionalDetail) {
            await Profile.findByIdAndDelete(user.additionalDetail);
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        console.error("DELETE ACCOUNT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete account",
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
            return res.status(400).json({ success: false, message: "Profile picture is required" });
        }

        if (!imageFile.mimetype.startsWith("image")) {
            return res.status(400).json({ success: false, message: "Only image files allowed" });
        }

        const uploadedImage = await uploadFileCloudinary(
            imageFile,
            "profile_pictures",
            "image"
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: uploadedImage.secure_url },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

