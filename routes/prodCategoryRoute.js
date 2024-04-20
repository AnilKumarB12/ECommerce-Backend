const express = require('express'); // Import Express framework
const { 
    createCategory, // Function to create a new product category
    updateCategory, // Function to update a product category by ID
    getAllCategories, // Function to get all product categories
    getCategory, // Function to get a product category by ID
    deleteCategory // Function to delete a product category by ID
} = require('../controller/prodCategoryControl'); // Import controller functions for product category management
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Initialize Express router

// Define routes

// Route for creating a new product category
router.post('/', authMiddleWare, isAdmin, createCategory);

// Route for updating a product category by ID
router.put('/:id', authMiddleWare, isAdmin, updateCategory);

// Route for getting a product category by ID
router.get('/:id', authMiddleWare, isAdmin, getCategory);

// Route for getting all product categories
router.get('/', authMiddleWare, isAdmin, getAllCategories);

// Route for deleting a product category by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteCategory);

module.exports = router; // Export the router to make it accessible in other parts of the application
