const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/ValidateMongodbId');

// Create a new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update an enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedEnquiry);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete an enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json({ deletedEnquiry });
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get a specific enquiry by ID
const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getAEnquiry = await Enquiry.findById(id);
        res.json({ getAEnquiry });
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all enquiries
const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.json({ enquiries });
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiry, getEnquiry };
