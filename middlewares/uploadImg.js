// Import necessary modules
const multer = require('multer'); // Import Multer for file uploads
const sharp = require('sharp'); // Import Sharp for image processing
const path = require('path'); // Import Path for file path operations
const fs = require("fs"); // Import File System module for file operations

// Define Multer storage configuration
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination directory for storing uploaded images
        cb(null, path.join(__dirname, '../public/images/'));
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + '.jpeg');
    }
});

// Define Multer file filter for image files
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        // Allow only image files
        cb(null, true);
    } else {
        // Reject non-image files
        cb({ message: "Unsupported file format" }, false);
    }
};

// Initialize Multer upload middleware for photo uploads
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 10000000 } // Limit file size to 10MB
});

// Middleware function to resize product images
const productImgResize = async (req, res, next) => {
    // Check if there are uploaded files
    if (!req.files) {
        return next();
    }
    // Resize each uploaded image asynchronously
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300) // Resize image to 300x300 pixels
            .toFormat("jpeg") // Convert image format to JPEG
            .jpeg({ quality: 90 }) // Set JPEG quality to 90
            .toFile(`public/images/products/${file.filename}`); // Save resized image
        // Delete the original image file
        fs.unlinkSync(`public/images/products/${file.filename}`);
    }));
    next();
};

// Middleware function to resize blog images
const blogImgResize = async (req, res, next) => {
    // Check if there are uploaded files
    if (!req.files) {
        return next();
    }
    // Resize each uploaded image asynchronously
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300) // Resize image to 300x300 pixels
            .toFormat("jpeg") // Convert image format to JPEG
            .jpeg({ quality: 90 }) // Set JPEG quality to 90
            .toFile(`public/images/blogs/${file.filename}`); // Save resized image
        // Delete the original image file
        try {
            fs.unlinkSync(file.path);
        } catch (error) {
            console.error(error);
        }
    }));
    next();
};

// Export middleware functions for uploading and resizing images
module.exports = { uploadPhoto, productImgResize, blogImgResize };
