const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// Middleware function for authentication using JWT
const authMiddleWare = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the request headers contain a token in the "Authorization" field
    if (req.headers?.authorization?.startsWith("Bearer")) {

        // Extract the token from the "Authorization" header
        token = req.headers.authorization.split(" ")[1]

        try {
            if (token) {
                // If a token is present in the request
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // Decode the token using the specified JWT secret

                const user = await User.findById(decoded?.id);
                // Find the user in the database using the decoded user ID from the token

                req.user = user;
                // Attach the user information to the request object for future use in the route handler

                next();
                // Call the next middleware or route handler in the request-response cycle
            }
        } catch (error) {
            // Handle token verification or database lookup errors
            throw new Error('Not Authorized: Token expired or invalid. Please login again');
        }
    } else {
        // If there is no "Authorization" header or it doesn't start with "Bearer"
        throw new Error('Not Authorized: No token attached to the header');
    }
});

// Middleware function to check if the user is an admin
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;

    // Find the user in the database based on the email
    const adminUser = await User.findOne({ email });

    if (adminUser.role !== "admin") {
        // If the user is not an admin, throw an error
        throw new Error("You are not an admin");
    } else {
        // If the user is an admin, proceed to the next middleware or route handler
        next();
    }
});
// Export the authentication middleware
module.exports = { authMiddleWare, isAdmin };
