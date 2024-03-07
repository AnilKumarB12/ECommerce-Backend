// Import necessary module
const jwt = require("jsonwebtoken");

// Function to generate a JWT token with a given user ID
const generateToken = (id) => {
    // Sign a JWT token with the user ID, using the secret key from the environment variables
    // The token expires in 2 days (you can adjust the expiresIn value as needed)
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Export the function to make it accessible in other parts of the application
module.exports = { generateToken };
