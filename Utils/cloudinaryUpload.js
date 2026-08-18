import cloudinary from "../Config/CloudinaryConfig.js";

// Wraps Cloudinary's upload_stream (callback-based) in a Promise so it can
// be awaited normally. Takes a Buffer (from multer.memoryStorage()) and
// resolves with the uploaded image's secure Cloudinary URL.
export const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce-products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Uploads multiple files (from req.files) in parallel, returns an array of URLs
export const uploadMultipleToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];
  const uploads = files.map((file) => uploadBufferToCloudinary(file.buffer));
  return Promise.all(uploads);
};