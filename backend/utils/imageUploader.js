const { cloudinary } = require("../config/cloudinary");

// Upload file (image or video) to Cloudinary
// type = "image" or "video"
exports.uploadFileCloudinary = async (file, folder, type = "image", height, quality) => {
    try {
        if (!file || !file.tempFilePath) {
            throw new Error("File path missing for Cloudinary upload");
        }

        const options = {
            folder: folder || "default-folder",
            resource_type: type,   // ✅ use the type parameter
        };

        if (height) options.height = height;
        if (quality) options.quality = quality;

        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);
        return uploadedFile;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
