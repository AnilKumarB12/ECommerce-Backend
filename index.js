// Import necessary modules and packages
const express = require("express");
const app = express();
const dbConnect = require("./config/dbConnect"); // Import the function to connect to the database
const dotenv = require("dotenv").config(); // Load environment variables from a .env file
const PORT = process.env.PORT || 4000; // Set the port for the server
const authRouter = require("./routes/authRoutes"); // Import the router for authentication routes
const bodyParser = require("body-parser"); // Parse incoming request bodies
const { notFound, errorHandler } = require("./middlewares/errorHandler"); // Custom error handling middleware

// Connect to the database
dbConnect();

// Use body-parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the authentication router for routes starting with "/api/user"
app.use("/api/user", authRouter);

// Custom middleware for handling 404 Not Found errors
app.use(notFound);

// Custom middleware for handling other errors
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
