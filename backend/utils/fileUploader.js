// const cloudinary = require("cloudinary").v2;


// exports.uploadImageCloudinary = async (
//     filePath,
//     folder,
//     type = "image",
//     height,
//     quality
// ) => {
//     if (!filePath || typeof filePath !== "string") {
//         throw new Error("File path missing for Cloudinary upload");
//     }

//     return await cloudinary.uploader.upload(filePath, {
//         folder,
//         resource_type: type,
//         height,
//         quality,
//     });
// };

const cloudinary = require("cloudinary").v2;

// Upload file buffer (for videos)
const uploadFileCloudinary = (fileBuffer, folder, type = "image", height, quality) => {
    return new Promise((resolve, reject) => {
        const options = { folder: folder || "default-folder", resource_type: type };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });

        stream.end(fileBuffer);
    });
};

// Optional: also export image uploader
const uploadImageCloudinary = async (filePath, folder, type = "image", height, quality) => {
    return await cloudinary.uploader.upload(filePath, { folder, resource_type: type, height, quality });
};

module.exports = { uploadFileCloudinary, uploadImageCloudinary };

