// Import necessary module
const express = require('express'); // Import Express framework

// Create a router instance to define authentication-related routes
const router = express.Router(); // Initialize Express router

// Import controller functions from the userControl module
const { 
    createUser, // Function to create a new user
    loginUserCtrl, // Function to handle user login
    getAllUser, // Function to retrieve all users
    getSingleUser, // Function to retrieve a single user by ID
    deleteSingleUser, // Function to delete a single user by ID
    updateSingleUser, // Function to update a single user by ID
    blockUser, // Function to block a user
    unBlockUser, // Function to unblock a user
    handleRefreshToken, // Function to handle refresh token
    logout, // Function to log out a user
    updatePassword, // Function to update user's password
    forgotPasswordToken, // Function to generate token for resetting password
    resetPassword, // Function to reset user's password
    loginAdmin, // Function to handle admin login
    getWishlist, // Function to get user's wishlist
    saveAddress, // Function to save user's address
    userCart, // Function to handle user's cart
    getUserCart, // Function to get user's cart
    emptyCart, // Function to empty user's cart
    applyCoupon, // Function to apply coupon to user's cart
    createOrder, // Function to create order
    getOrders, // Function to get user's orders
    getAllOrders, // Function to get all orders
    updateOrderStatus // Function to update order status
} = require("../controller/userControl"); // Import controller functions for user management

const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare'); // Import middleware functions for authentication

// Define routes

// Route for creating a new user
router.post("/register", createUser);

// Route for generating token for password reset
router.post('/forgot-password-token', forgotPasswordToken);

// Route for resetting password
router.put('/reset-password/:token', resetPassword);

// Route for user login
router.post("/login", loginUserCtrl);

// Route for admin login
router.post("/admin-login", loginAdmin);

// Route for managing user's cart
router.post("/cart", authMiddleWare, userCart);

// Route for applying coupon to user's cart
router.post("/cart/apply-coupon", authMiddleWare, applyCoupon);

// Route for creating order
router.post("/cart/create-order", authMiddleWare, createOrder);

// Route for updating user's password
router.put("/password", authMiddleWare, updatePassword);

// Route for retrieving all users
router.get("/all-users", getAllUser);

// Route for getting user's cart
router.get("/cart", authMiddleWare, getUserCart);

// Route for getting user's orders
router.get("/orders", authMiddleWare, getOrders);

// Route for getting all orders
router.get("/all-orders", authMiddleWare, getAllOrders);

// Route for generating access token when a refresh token is generated
router.get("/refresh", handleRefreshToken);

// Route for logging out
router.get("/logout", logout);

// Route for getting user's wishlist
router.get("/wishlist", authMiddleWare, getWishlist);

// Route for retrieving a single user by ID
router.get("/:id", authMiddleWare, isAdmin, getSingleUser);

// Route for deleting a single user by ID
router.delete("/:id", deleteSingleUser);

// Route for updating a single user by ID
router.put("/update", authMiddleWare, updateSingleUser);

// Route for updating order status
router.put('/update-order/:id', updateOrderStatus);

// Route for saving user's address
router.put("/save-address", authMiddleWare, saveAddress);

// Route for blocking a user
router.put("/block-user/:id", authMiddleWare, isAdmin, blockUser);

// Route for unblocking a user
router.put("/unblock-user/:id", authMiddleWare, isAdmin, unBlockUser);

// Route for exporting the router to make it accessible in other parts of the application
module.exports = router;
