// utils/fileUploader.js
const { cloudinary } = require("../config/cloudinary");

// Upload file buffer to Cloudinary (for multer.memoryStorage)
exports.uploadFileCloudinary = (fileBuffer, folder, type = "image", height, quality) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder: folder || "default-folder",
            resource_type: type,
        };

        if (height) options.height = height;
        if (quality) options.quality = quality;

        const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });

        // send buffer to Cloudinary
        stream.end(fileBuffer);
    });
};
