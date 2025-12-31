const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const { uploadImageCloudinary } = require("../utils/fileUploader");

// -----------------------------------------------------------------------------------
// UPDATE PROFILE (Fixed for Cloudinary)
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

// -----------------------------------------------------------------------------------
// UPDATE PROFILE PICTURE (Fixed for Cloudinary)
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


// -----------------------------------------------------------------------------------
// GET FULL PROFILE DETAILS (Fixed)
// -----------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------
// DELETE ACCOUNT (Production Ready)
// -----------------------------------------------------------------------------------
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


// -----------------------------------------------------------------------------------
// GET ENROLLED COURSES (Fixed)
// -----------------------------------------------------------------------------------
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "course",
                    model: "Course"
                }
            })
            .select("courses")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses || [],
        });
    } catch (error) {
        console.error("GET COURSES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
