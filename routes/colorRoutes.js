const express = require('express'); // Import Express framework
const { 
    createColor, // Function to create a new color
    updateColor, // Function to update a color
    getColor, // Function to get a single color by ID
    getAllColor, // Function to get all colors
    deleteColor // Function to delete a color by ID
} = require('../controller/colorControl'); // Import controller functions for color management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new color
router.post('/', authMiddleWare, isAdmin, createColor);

// Route for updating a color by ID
router.put('/:id', authMiddleWare, isAdmin, updateColor);

// Route for getting a single color by ID
router.get('/:id', authMiddleWare, isAdmin, getColor);

// Route for getting all colors
router.get('/', authMiddleWare, isAdmin, getAllColor);

// Route for deleting a color by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteColor);

module.exports = router; // Export the router to make it accessible in other parts of the application
