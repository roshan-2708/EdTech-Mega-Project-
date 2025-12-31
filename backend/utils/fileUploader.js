const cloudinary = require("cloudinary").v2;


exports.uploadImageCloudinary = async (
    filePath,
    folder,
    type = "image",
    height,
    quality
) => {
    if (!filePath || typeof filePath !== "string") {
        throw new Error("File path missing for Cloudinary upload");
    }

    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: type,
        height,
        quality,
    });
};
