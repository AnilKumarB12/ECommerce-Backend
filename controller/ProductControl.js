const Product = require('../models/productModel'); // Import the Product model
const User = require('../models/userModel'); // Import the User model
const asyncHandler = require('express-async-handler'); // Import asyncHandler middleware
const slugify = require('slugify'); // Import slugify for generating slugs
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Import MongoDB ID validation utility
const fs = require("fs"); // Import file system module
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary"); // Import functions for interacting with Cloudinary

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
    try {
        // Generate a slug from the product title
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body); // Create a new product with the request body
        res.json(newProduct); // Respond with the newly created product
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the product to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Generate a slug from the updated product title
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }); // Find the product by ID and update it with the request body
        res.json(updatedProduct); // Respond with the updated product
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the product to delete from request parameters
    try {
        // Generate a slug from the product title (not used in delete, can be removed)
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deletedProduct = await Product.findByIdAndDelete(id); // Find the product by ID and delete it
        res.json(deletedProduct); // Respond with the deleted product
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get a specific product by ID
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the product to retrieve from request parameters
    try {
        const findProduct = await Product.findById(id); // Find the product by ID
        res.json(findProduct); // Respond with the retrieved product
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all products with optional filtering, sorting, and pagination
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filter products based on query parameters
        const queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete queryObject[field]);
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryString));

        // Sorting products
        if (req.query.sort) {
            const sort = req.query.sort.split(',').join(' ');
            query = query.sort(sort);
        } else {
            query = query.sort('-createdAt');
        }

        // Limit the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error('This page does not exist');
            }
        }
        const product = await query;

        res.json(product); // Respond with the list of products
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Add a product to the user's wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user; // Extract the ID of the user from the request user object
    const { prodId } = req.body; // Extract the ID of the product to add from the request body
    try {
        const user = await User.findById(_id); // Find the user by ID
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId); // Check if the product is already in the wishlist
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, { $pull: { wishlist: prodId } }, { new: true }); // If already added, remove the product from the wishlist
            res.json(user); // Respond with the updated user
        } else {
            let user = await User.findByIdAndUpdate(_id, { $push: { wishlist: prodId } }, { new: true }); // If not added, add the product to the wishlist
            res.json(user); // Respond with the updated user
        }
    }
    catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Rate a product
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user; // Extract the ID of the user from the request user object
    const { star, prodId, comment } = req.body; // Extract rating details from the request body
    const product = await Product.findById(prodId); // Find the product by ID
    const alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString()); // Check if the user has already rated the product
    try {
        if (alreadyRated) {
            const updateRating = await Product.updateOne({ ratings: { $elemMatch: alreadyRated } }, { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }, { new: true }); // If already rated, update the rating
        }
        else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id
                    }
                }
            }, { new: true }); // If not rated, add a new rating
        }
        const getAllRatings = await Product.findById(prodId); // Get all ratings for the product
        let totalRatings = getAllRatings.ratings.length;
        let sumOfRatings = getAllRatings.ratings.map((item) => item.star).reduce((prev, cur) => prev + cur, 0); // Calculate the sum of ratings
        let actualRating = Math.round(sumOfRatings / totalRatings); // Calculate the average rating
        let finalProduct = await Product.findByIdAndUpdate(prodId, { totalRatings: actualRating }, { new: true }); // Update the total rating for the product
        res.json(finalProduct); // Respond with the updated product
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Upload images to Cloudinary
const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images"); // Define a function for uploading images to Cloudinary
        const urls = [];
        // sourcery skip: use-object-destructuring
        const files = req.files; // Extract uploaded files from the request
        for (const file of files) {
            const { path } = file; // Extract the file path
            const newpath = await uploader(path); // Upload the image to Cloudinary
            urls.push(newpath.url); // Push the URL of the uploaded image to the array
        };
        const images = urls.map((file) => { return file }); // Create an array of image URLs
        res.json(images); // Respond with the uploaded image URLs
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error); // Log any errors that occur during image upload
    }
});

// Delete images from Cloudinary
const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the image to delete from request parameters
    try {
        const deleted = cloudinaryDeleteImg(id, "images"); // Delete the image from Cloudinary
        res.json({ message: "Deleted" }); // Respond with a success message
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Export the functions for use in other modules
module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages };
