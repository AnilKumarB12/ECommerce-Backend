const express = require('express'); // Import Express framework
const { 
    createEnquiry, // Function to create a new enquiry
    updateEnquiry, // Function to update an enquiry by ID
    getEnquiry, // Function to get an enquiry by ID
    getAllEnquiry, // Function to get all enquiries
    deleteEnquiry // Function to delete an enquiry by ID
} = require('../controller/enqControl'); // Import controller functions for enquiry management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new enquiry
router.post('/', authMiddleWare, isAdmin, createEnquiry);

// Route for updating an enquiry by ID
router.put('/:id', authMiddleWare, isAdmin, updateEnquiry);

// Route for getting an enquiry by ID
router.get('/:id', authMiddleWare, isAdmin, getEnquiry);

// Route for getting all enquiries
router.get('/', authMiddleWare, isAdmin, getAllEnquiry);

// Route for deleting an enquiry by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteEnquiry);

module.exports = router; // Export the router to make it accessible in other parts of the application
