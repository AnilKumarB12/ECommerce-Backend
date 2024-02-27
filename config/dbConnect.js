// Import necessary module
const mongoose = require("mongoose");

// Function to connect to the MongoDB database
const dbConnect = () => {
    try {
        // Attempt to connect to the MongoDB database using the provided URL from environment variables
        const conn = mongoose.connect(process.env.MONGODB_URL);

        // Log a success message if the connection is successful
        console.log("Database Connected Successfully");
    } catch (error) {
        // Log an error message if there's an issue connecting to the database
        console.log("Database error");
    }
};

// Export the function to make it accessible in other parts of the application
module.exports = dbConnect;
