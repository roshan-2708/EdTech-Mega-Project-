const { cloudinary } = require("../config/cloudinary");

exports.uploadFileCloudinary = async (file, folder, type = "image", height, quality) => {
    if (!file || !file.tempFilePath) {
        throw new Error("File path missing for Cloudinary upload");
    }

    const options = {
        folder,
        resource_type: type,
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
