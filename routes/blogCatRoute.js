const express = require('express'); // Import Express framework
const { 
    createCategory, // Function to create a new blog category
    updateCategory, // Function to update a blog category
    getAllCategories, // Function to get all blog categories
    getCategory, // Function to get a single blog category by ID
    deleteCategory // Function to delete a blog category by ID
} = require('../controller/blogCatControl'); // Import controller functions for blog category management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new blog category
router.post('/', authMiddleWare, isAdmin, createCategory);

// Route for updating a blog category by ID
router.put('/:id', authMiddleWare, isAdmin, updateCategory);

// Route for getting a single blog category by ID
router.get('/:id', authMiddleWare, isAdmin, getCategory);

// Route for getting all blog categories
router.get('/', authMiddleWare, isAdmin, getAllCategories);

// Route for deleting a blog category by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteCategory);

module.exports = router; // Export the router to make it accessible in other parts of the application
