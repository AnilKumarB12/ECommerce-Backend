// Import necessary modules and packages
const express = require("express");
const app = express();
const dbConnect = require("./config/dbConnect"); // Import the function to connect to the database
const dotenv = require("dotenv").config(); // Load environment variables from a .env file
const PORT = process.env.PORT || 4000; // Set the port for the server
const authRouter = require("./routes/authRoutes"); // Import the router for authentication routes
const productRoute = require("./routes/productRoute");
const prodCategoryRoute = require("./routes/prodCategoryRoute");
const blogCategoryRoute = require("./routes/blogCatRoute");
const brandRoute = require("./routes/brandRoute");
const blogRoute = require("./routes/blogRoute");
const couponRoute = require("./routes/couponRoute"); 
const bodyParser = require("body-parser"); // Parse incoming request bodies
const { notFound, errorHandler } = require("./middlewares/errorHandler"); // Custom error handling middleware
const cookieParser = require("cookie-parser")
const morgan = require("morgan"); //
// Connect to the database
dbConnect();


app.use(morgan('dev'));
// Use body-parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the authentication router for routes starting with "/api/user"
app.use("/api/user", authRouter);

app.use("/api/product", productRoute);

app.use("/api/blog", blogRoute);

app.use("/api/category", prodCategoryRoute);

app.use("/api/blogCategory", blogCategoryRoute);

app.use("/api/brand", brandRoute);

app.use("/api/coupon", couponRoute);

// Custom middleware for handling 404 Not Found errors
app.use(notFound);

// Custom middleware for handling other errors
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
