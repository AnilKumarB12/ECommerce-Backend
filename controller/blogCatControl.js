// Import necessary modules and models
const blogCategory = require("../models/blogCatModel"); // Import the Blog Category model
const asyncHandler = require("express-async-handler"); // Import asyncHandler middleware
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Import MongoDB ID validation utility

// Middleware for creating a new blog category
const createCategory = asyncHandler(async (req, res) => {
    try {
        // Create a new blog category using data from the request body
        const newBlogCategory = await blogCategory.create(req.body);
        // Respond with the newly created blog category
        res.json(newBlogCategory);
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    }
});

// Middleware for updating an existing blog category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog category to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find and update the blog category by its ID, returning the updated blog category
        const updatedBlogCategory = await blogCategory.findByIdAndUpdate(id, req.body, { new: true });
        // Respond with the updated blog category
        res.json(updatedBlogCategory);
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    }
});

// Middleware for deleting a blog category by its ID
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog category to delete from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find and delete the blog category by its ID
        const deletedCategory = await blogCategory.findByIdAndDelete(id);
        // Respond with the deleted blog category
        res.json({ deletedCategory });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    }
});

// Middleware for getting a specific blog category by its ID
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog category to retrieve from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find the blog category by its ID
        const category = await blogCategory.findById(id);
        // Respond with the retrieved blog category
        res.json({ category });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    }
});

// Middleware for getting all blog categories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        // Find all blog categories
        const Categories = await blogCategory.find();
        // Respond with the array of blog categories
        res.json({ Categories });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    }
});

// Export all the middleware functions
module.exports = { createCategory, updateCategory, deleteCategory, getAllCategories, getCategory };
