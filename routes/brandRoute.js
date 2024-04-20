const express = require('express'); // Import Express framework
const { 
    createBrand, // Function to create a new brand
    updateBrand, // Function to update a brand
    getBrand, // Function to get a single brand by ID
    getAllBrand, // Function to get all brands
    deleteBrand // Function to delete a brand by ID
} = require('../controller/brandControl'); // Import controller functions for brand management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new brand
router.post('/', authMiddleWare, isAdmin, createBrand);

// Route for updating a brand by ID
router.put('/:id', authMiddleWare, isAdmin, updateBrand);

// Route for getting a single brand by ID
router.get('/:id', authMiddleWare, isAdmin, getBrand);

// Route for getting all brands
router.get('/', authMiddleWare, isAdmin, getAllBrand);

// Route for deleting a brand by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteBrand);

module.exports = router; // Export the router to make it accessible in other parts of the application
