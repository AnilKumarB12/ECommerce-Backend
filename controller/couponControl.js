const Coupon = require('../models/couponModel'); // Import the Coupon model
const asyncHandler = require("express-async-handler"); // Import asyncHandler middleware
const validateMongoDbId = require('../utils/ValidateMongodbId'); // Import MongoDB ID validation utility

// Create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body); // Create a new coupon document with the request body
        res.json(newCoupon); // Respond with the newly created coupon
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find(); // Find all coupons
        res.json(coupons); // Respond with the list of coupons
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update a coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the coupon to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true }); // Find the coupon by ID and update it with the request body
        res.json(updatedCoupon); // Respond with the updated coupon
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the coupon to delete from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id); // Find the coupon by ID and delete it
        res.json(deletedCoupon); // Respond with the deleted coupon
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Export the functions for use in other modules
module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
