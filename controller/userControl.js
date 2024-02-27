// Import necessary modules and packages
const { generateToken } = require("../config/jwtToken"); // Import the function to generate JWT tokens
const User = require("../models/userModel"); // Import the User model
const asyncHandler = require("express-async-handler"); // Import the express-async-handler utility
const validateMongoDbId = require("../utils/ValidateMongodbId");

// Controller function for creating a new user
const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body.email;
    const findUser = await User.findOne({ email });

    if (!findUser) {
        // Create a new user if not found
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // Throw an error if the user already exists
        throw new Error('User Already Exists');
    }
});

// Controller function for user login
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists and the password matches
    const findUser = await User.findOne({ email });

    if (findUser && await findUser.isPasswordMatched(password)) {
        // If user exists and password matches, send user details and a JWT token in the response
        //The optional chaining operator {?} prevents accessing properties on null or undefined values and short-circuits the expression, ensuring that the result is always undefined in such cases.
        res.json({
            _id: findUser?._id,
            fname: findUser?.fname,
            lname: findUser?.lname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        // Throw an error for invalid credentials
        throw new Error("Invalid Credentials");
    }
});

//Update a user 
const updateSingleUser = asyncHandler(async (req, res) => {
    //before executing updateSingleUser authMiddleWare and isAdmin verifications are executed 
    //user contains all the information about a user
    const { id } = req.user;
    validateMongoDbId(id);
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            fname: req?.body.fname,
            lname: req?.body.lname,
            email: req?.body.email,
            mobile: req?.body.mobile
        },
            { new: true, }
        )
        res.json(updateUser)
    } catch (error) {
        // Throw an error if there's an issue retrieving users
        throw new Error(error);
    }
})

// Controller function to get all users
const getAllUser = asyncHandler(async (req, res) => {
    try {
        // Retrieve all users from the database
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        // Throw an error if there's an issue retrieving users
        throw new Error(error);
    }
});

//Controller function to get a single user
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        // Retrieve a user from the database
        const getUser = await User.findById(id)
        res.json({ getUser, });
    } catch (error) {
        throw new Error(error)
    }
});

//Controller function to delete a single user
const deleteSingleUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Validate that the ID is a valid MongoDB ObjectId
    validateMongoDbId(id);

    try {
        // Delete a user in the database
        const deleteUser = await User.findByIdAndDelete(id);

        // Respond with the deleted user details
        res.json({ deleteUser });
    } catch (error) {
        // Handle any errors that occur during the deletion process
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Validate that the ID is a valid MongoDB ObjectId
    validateMongoDbId(id);

    try {
        // Block a user by updating 'isBlocked' field
        const block = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

        // Respond with the updated user details
        res.json(block);
    } catch (error) {
        // Handle any errors that occur during the blocking process
        throw new Error(error);
    }
});

const unBlockUser = asyncHandler(async (req, res) => {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Validate that the ID is a valid MongoDB ObjectId
    validateMongoDbId(id);

    try {
        // Unblock a user by updating 'isBlocked' field
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });

        // Respond with the updated user details
        res.json(unblock);
    } catch (error) {
        // Handle any errors that occur during the unblocking process
        throw new Error(error);
    }
});

// Export the controller functions
module.exports = { createUser, loginUserCtrl, getAllUser, getSingleUser, deleteSingleUser, updateSingleUser, blockUser, unBlockUser };
