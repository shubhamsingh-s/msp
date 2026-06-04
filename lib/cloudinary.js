const cloudinary = require('cloudinary').v2;
require('dotenv').config();

if (process.env.CLOUDINARY_URL) {
  // Clean up CLOUDINARY_URL: trim whitespace and strip any accidental < > brackets
  process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL.trim().replace(/[<>]/g, '');
} else {
  cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
  });
}

function uploadToCloudinary(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.write(fileBuffer);
    uploadStream.end();
  });
}

module.exports = {
  uploadToCloudinary
};
