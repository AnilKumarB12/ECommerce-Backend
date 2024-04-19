// Import necessary module
const express = require('express');

// Create a router instance to define authentication-related routes
const router = express.Router();

// Import controller functions from the userControl module
const { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, getAllOrders, updateOrderStatus } = require("../controller/userControl");
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');

// Define the "/register" route for creating a new user
router.post("/register", createUser);

router.put('/reset-password/:token', resetPassword);

router.post('/forgot-password-token', forgotPasswordToken)

// Define the "/login" route for user login
router.post("/login", loginUserCtrl);

router.post("/admin-login", loginAdmin);

router.post("/cart", authMiddleWare, userCart);

router.post("/cart/apply-coupon", authMiddleWare, applyCoupon);

router.post("/cart/create-order", authMiddleWare, createOrder);

router.put("/password", authMiddleWare, updatePassword)

// Define the "/all-users" route for retrieving all users
router.get("/all-users", getAllUser);

router.get("/cart",authMiddleWare,getUserCart);

router.get("/orders",authMiddleWare,getOrders);

router.get("/all-orders",authMiddleWare,getAllOrders);


// Define the "/refresh" route for generating access token when a refresh token is generated 
router.get("/refresh", handleRefreshToken);

// Define the "/logout" route for logging user out
router.get("/logout", logout);

router.get("/wishlist", authMiddleWare, getWishlist);

// Define the "/single-user" route for retrieving all users
router.get("/:id", authMiddleWare, isAdmin, getSingleUser);

router.delete("/empty-cart", authMiddleWare, emptyCart);
// Define the "/delete-user" route for retrieving all users
router.delete("/:id", deleteSingleUser);

// Define the "/Update-user" route for retrieving all users
router.put("/update",authMiddleWare, updateSingleUser)

router.put('/Update-order/:id', updateOrderStatus); 

router.put("/save-address",authMiddleWare, saveAddress )

router.put("/block-user/:id",authMiddleWare,isAdmin, blockUser)

router.put("/unblock-user/:id",authMiddleWare,isAdmin, unBlockUser)

// Define the "/single-user" route for retrieving all users

// Export the router to make it accessible in other parts of the application
module.exports = router;
