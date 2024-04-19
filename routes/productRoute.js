const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages } = require('../controller/ProductControl');
const {uploadPhoto, productImgResize} = require('../middlewares/uploadImg');
const { isAdmin, authMiddleWare } = require('../middlewares/authMiddleWare');

// Create a new router instance
const router  = express.Router();

// Routes for handling CRUD operations on products

// Route to create a new product
router.post('/', authMiddleWare, isAdmin, createProduct);

router.put('/upload/', authMiddleWare, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);

router.put('/delete/:id', authMiddleWare, isAdmin, deleteImages);

// Route to get a specific product by ID
router.get('/:id', getProduct);

router.put('/wishlist', authMiddleWare, addToWishlist);

router.put('/rating', authMiddleWare, rating);

// Route to update a product by ID
router.put('/:id', authMiddleWare, isAdmin, updateProduct);

// Route to delete a product by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteProduct);

router.delete('/delete/:id', authMiddleWare, isAdmin, deleteImages);

// Route to get all products
router.get('/', getAllProducts);

// Export the router to make it available to other parts of the application
module.exports = router;