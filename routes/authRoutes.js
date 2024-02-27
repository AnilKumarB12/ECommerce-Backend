// Import necessary module
const express = require('express');

// Create a router instance to define authentication-related routes
const router = express.Router();

// Import controller functions from the userControl module
const { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser } = require("../controller/userControl");
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');

// Define the "/register" route for creating a new user
router.post("/register", createUser);

// Define the "/login" route for user login
router.post("/login", loginUserCtrl);

// Define the "/all-users" route for retrieving all users
router.get("/all-users", getAllUser);

// Define the "/single-user" route for retrieving all users
router.get("/:id", authMiddleWare, isAdmin, getSingleUser);

// Define the "/delete-user" route for retrieving all users
router.delete("/:id", deleteSingleUser);

// Define the "/Update-user" route for retrieving all users
router.put("/update",authMiddleWare, updateSingleUser)

// Define the "/block-user" route for retrieving all users
router.put("/block-user/:id",authMiddleWare,isAdmin, blockUser)

// Define the "/Unblock-user" route for retrieving all users
router.put("/unblock-user/:id",authMiddleWare,isAdmin, unBlockUser)

// Export the router to make it accessible in other parts of the application
module.exports = router;
