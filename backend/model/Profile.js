const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: false,
            default: "Other",       // ✅ default value
        },
        dateOfBirth: {
            type: Date,             // ✅ correct type
            default: null,
        },
        about: {
            type: String,
            trim: true,
            default: "",
        },
        contactNumber: {
            type: String,           // ✅ correct type
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Profile", profileSchema);
