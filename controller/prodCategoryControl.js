const ProdCategory = require("../models/prodCategoryModel"); // Import the product category model
const asyncHandler = require("express-async-handler"); // Import asyncHandler middleware
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Import MongoDB ID validation utility

// Create a new product category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newProdCategory = await ProdCategory.create(req.body); // Create a new product category document with the request body
        res.json(newProdCategory); // Respond with the newly created product category
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update a product category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the category to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const updatedProdCategory = await ProdCategory.findByIdAndUpdate(id, req.body, { new: true }); // Find the category by ID and update it with the request body
        res.json(updatedProdCategory); // Respond with the updated product category
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete a product category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the category to delete from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const deletedCategory = await ProdCategory.findByIdAndDelete(id); // Find the category by ID and delete it
        res.json({ deletedCategory }); // Respond with the deleted product category
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get a specific product category by ID
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the category to retrieve from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const category = await ProdCategory.findById(id); // Find the category by ID
        res.json({ category }); // Respond with the retrieved product category
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all product categories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await ProdCategory.find(); // Find all product categories
        res.json({ categories }); // Respond with the list of product categories
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Export the functions for use in other modules
module.exports = { createCategory, updateCategory, deleteCategory, getAllCategories, getCategory };
