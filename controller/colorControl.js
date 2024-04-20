const Color = require("../models/colorModel"); // Importing the Color model
const asyncHandler = require("express-async-handler"); // Importing asyncHandler middleware
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Importing function to validate MongoDB IDs

// Create a new color
const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body); // Creating a new color with data from request body
        res.json(newColor); // Sending the newly created color as a JSON response
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update a color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extracting color ID from request parameters
    validateMongoDbId(id); // Validating MongoDB ID
    try {
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true }); // Finding color by ID and updating its data
        res.json(updatedColor); // Sending the updated color as a JSON response
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete a color
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extracting color ID from request parameters
    validateMongoDbId(id); // Validating MongoDB ID
    try {
        const deletedColor = await Color.findByIdAndDelete(id); // Finding color by ID and deleting it
        res.json({ deletedColor }); // Sending the deleted color as a JSON response
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get a specific color by ID
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extracting color ID from request parameters
    validateMongoDbId(id); // Validating MongoDB ID
    try {
        const getAColor = await Color.findById(id); // Finding color by ID
        res.json({ getAColor }); // Sending the found color as a JSON response
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all colors
const getAllColor = asyncHandler(async (req, res) => {
    try {
        const colors = await Color.find(); // Finding all colors
        res.json({ colors }); // Sending all colors as a JSON response
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

module.exports = { createColor, updateColor, deleteColor, getAllColor, getColor }; // Exporting the functions for use in other files
