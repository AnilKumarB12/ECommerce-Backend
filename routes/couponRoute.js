const express = require('express'); // Import Express framework
const { 
    createCoupon, // Function to create a new coupon
    getAllCoupons, // Function to get all coupons
    updateCoupon, // Function to update a coupon by ID
    deleteCoupon // Function to delete a coupon by ID
} = require('../controller/couponControl'); // Import controller functions for coupon management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new coupon
router.post('/', authMiddleWare, isAdmin, createCoupon);

// Route for getting all coupons
router.get('/', authMiddleWare, isAdmin, getAllCoupons);

// Route for updating a coupon by ID
router.put('/:id', authMiddleWare, isAdmin, updateCoupon);

// Route for deleting a coupon by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteCoupon);

module.exports = router; // Export the router to make it accessible in other parts of the application
