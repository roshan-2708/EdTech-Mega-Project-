const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        accountType: {
            type: String,
            enum: ["Admin", "Student", "Instructor"],
            required: true,
        },

        additionalDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],

        // ✔ Renamed to image
        image: {
            type: String,
            default: "",
        },

        coursesProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress",
            }
        ],

        token: {
            type: String,
        },

        resetPasswordExpires: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
