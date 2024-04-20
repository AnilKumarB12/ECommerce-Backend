const express = require('express'); // Import Express framework
const { 
    createProduct, // Function to create a new product
    getProduct, // Function to get a specific product by ID
    getAllProducts, // Function to get all products
    updateProduct, // Function to update a product by ID
    deleteProduct, // Function to delete a product by ID
    addToWishlist, // Function to add a product to user's wishlist
    rating, // Function to rate a product
    uploadImages, // Function to upload images for a product
    deleteImages // Function to delete images of a product
} = require('../controller/ProductControl'); // Import controller functions for product management
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImg'); // Import middleware functions for image upload
const { isAdmin, authMiddleWare } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication
const router = express.Router(); // Create a new router instance

// Define routes

// Route to create a new product
router.post('/', authMiddleWare, isAdmin, createProduct);

// Route to upload images for a product
router.put('/upload/', authMiddleWare, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);

// Route to delete images of a product
router.put('/delete/:id', authMiddleWare, isAdmin, deleteImages);

// Route to get a specific product by ID
router.get('/:id', getProduct);

// Route to add a product to user's wishlist
router.put('/wishlist', authMiddleWare, addToWishlist);

// Route to rate a product
router.put('/rating', authMiddleWare, rating);

// Route to update a product by ID
router.put('/:id', authMiddleWare, isAdmin, updateProduct);

// Route to delete a product by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteProduct);

// Route to delete images of a product
router.delete('/delete/:id', authMiddleWare, isAdmin, deleteImages);

// Route to get all products
router.get('/', getAllProducts);

// Export the router to make it available to other parts of the application
module.exports = router;
