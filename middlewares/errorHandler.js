// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
    // Create an Error object with a 404 status and a message indicating the requested URL was not found
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404); // Set the HTTP status code to 404
    next(error); // Pass the error to the next middleware in the stack
};

// Middleware for handling other errors
const errorHandler = (err, req, res, next) => {
    // Determine the appropriate status code based on the original response status code
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    
    // Set the HTTP status code
    res.status(statusCode);

    // Send a JSON response with information about the error
    res.json({
        message: err?.message, // Include the error message
        stack: err?.stack, // Include the error stack trace
    });
};

// Export both middleware functions
module.exports = { errorHandler, notFound };
