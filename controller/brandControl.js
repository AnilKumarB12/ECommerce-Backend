const brand = require("../models/brandModel"); // Import the Brand model
const asyncHandler = require("express-async-handler"); // Import asyncHandler middleware
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Import MongoDB ID validation utility

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await brand.create(req.body); // Create a new brand with the request body
        res.json(newBrand); // Respond with the newly created brand
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Update a brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the brand to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const updatedBrand = await brand.findByIdAndUpdate(id, req.body, { new: true }); // Find the brand by ID and update it with the request body
        res.json(updatedBrand); // Respond with the updated brand
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Delete a brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the brand to delete from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const deletedBrand = await brand.findByIdAndDelete(id); // Find the brand by ID and delete it
        res.json({ deletedBrand }); // Respond with the deleted brand
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Get a specific brand by ID
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the brand to retrieve from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const getABrand = await brand.findById(id); // Find the brand by ID
        res.json({ getABrand }); // Respond with the retrieved brand
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Get all brands
const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const brands = await brand.find(); // Find all brands
        res.json({ brands }); // Respond with the list of brands
    } catch (error) {
        throw new Error(error); // Handle errors
    }
});

// Export the functions for use in other modules
module.exports = { createBrand, updateBrand, deleteBrand, getAllBrand, getBrand };
