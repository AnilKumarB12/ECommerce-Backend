// Import necessary module
const jwt = require("jsonwebtoken");

// Function to generate a refresh token based on user ID
const generateRefreshToken = (id) => {
    // Sign a JSON Web Token with the user's ID and a secret key, setting the expiration to 3 days
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Export the function to make it accessible in other parts of the application
module.exports = { generateRefreshToken };
