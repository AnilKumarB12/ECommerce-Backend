// Import necessary modules and models
const Blog = require("../models/blogModel"); // Import the Blog model
const validateMongoDbId = require("../utils/ValidateMongodbId"); // Import MongoDB ID validation utility
const User = require("../models/userModel"); // Import the User model
const asyncHandler = require("express-async-handler"); // Import asyncHandler middleware
const fs = require("fs"); // Import the fs module for file system operations
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary"); // Import cloudinary upload and delete functions

// Middleware for creating a new blog post
const createBlog = asyncHandler(async (req, res) => {
    try {
        // Create a new blog using data from the request body
        const newBlog = await Blog.create(req.body);
        // Respond with the newly created blog
        res.json({ newBlog });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for updating an existing blog post
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog to update from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find and update the blog by its ID, returning the updated blog
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        // Respond with the updated blog
        res.json({ updatedBlog });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
})

// Middleware for getting a specific blog post by its ID
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog to retrieve from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find the blog by its ID, populate the 'likes' and 'dislikes' fields,
        // and increment the 'numViews' field by 1
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });
        // Respond with the retrieved blog
        res.json({ getBlog });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for getting all blog posts
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        // Find all blogs
        const getAllBlogs = await Blog.find();
        // Respond with the array of blogs
        res.json({ getAllBlogs });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for deleting a blog post by its ID
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the blog to delete from request parameters
    validateMongoDbId(id); // Validate the MongoDB ID
    try {
        // Find and delete the blog by its ID
        const deletedBlog = await Blog.findByIdAndDelete(id);
        // Respond with the deleted blog
        res.json({ deletedBlog });
    }
    catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for handling the 'like' functionality of a blog post
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body; // Extract the ID of the blog from the request body
    validateMongoDbId(blogId); // Validate the MongoDB ID

    try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id; // Get the ID of the logged-in user
        const isLiked = blog?.isLiked; // Check if the user has already liked the blog
        const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());

        // Handle the case where the user has already disliked the blog
        if (alreadyDisliked) {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            }, { new: true });

            res.json({ blog: updatedBlog });
        }

        // Handle the case where the user has already liked the blog
        if (isLiked) {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            }, { new: true });

            res.json({ blog: updatedBlog });
        } else { // Handle the case where the user hasn't liked the blog yet
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true
            }, { new: true });

            res.json({ blog: updatedBlog });
        }
    } catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for handling the 'dislike' functionality of a blog post
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body; // Extract the ID of the blog from the request body
    validateMongoDbId(blogId); // Validate the MongoDB ID

    try {
        // Find the blog by its ID
        const blog = await Blog.findById(blogId);
        const loginUserId = req?.user?._id; // Get the ID of the logged-in user
        const isDisliked = blog?.isDisliked; // Check if the user has already disliked the blog
        const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());

        // Handle the case where the user has already liked the blog
        if (alreadyLiked) {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            }, { new: true });

            res.json({ blog: updatedBlog });
        }

        // Handle the case where the user has already disliked the blog
        if (isDisliked) {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            }, { new: true });

            res.json({ blog: updatedBlog });
        } else { // Handle the case where the user hasn't disliked the blog yet
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId },
                isDisliked: true
            }, { new: true });

            res.json({ blog: updatedBlog });
        }
    } catch (error) {
        // Handle errors and propagate them
        throw new Error(error);
    };
});

// Middleware for uploading images to Cloudinary
const uploadImages = asyncHandler(async (req, res, next) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
// sourcery skip: use-object-destructuring
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath.url);
        };
        const images =  urls.map((file) => { return file })
        res.json(images);
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        next();
    }
});

// Middleware for deleting images from Cloudinary
const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID of the image to delete from request parameters
    try {
        const deleted = cloudinaryDeleteImg(id, "images"); // Delete the image from Cloudinary
        res.json({ message: "Deleted" }); // Respond with success message
    } catch (error) {
        throw new Error(error); // Handle errors and propagate them
    }
});

// Export all the middleware functions
module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages, deleteImages };
