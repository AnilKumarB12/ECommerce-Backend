const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/ValidateMongodbId');
const fs = require("fs");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
    try {
        // Generate a slug from the product title
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        // Generate a slug from the updated product title
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        // Generate a slug from the product title (not used in delete, can be removed)
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get a specific product by ID
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

// Get all products with optional filtering, sorting, and pagination
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filter products based on query parameters
        const queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete queryObject[field]);
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryString));

        // Sorting products
        if (req.query.sort) {
            const sort = req.query.sort.split(',').join(' ');
            query = query.sort(sort);
        } else {
            query = query.sort('-createdAt');
        }

        // Limit the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error('This page does not exist');
            }
        }
        const product = await query;

        res.json(product);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, { $pull: { wishlist: prodId } }, { new: true });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, { $push: { wishlist: prodId } }, { new: true });
            res.json(user);
        }
    }
    catch (error) {
        // Handle errors
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    const product = await Product.findById(prodId);
    const alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());
    try {
        if (alreadyRated) {
            const updateRating = await Product.updateOne({ ratings: { $elemMatch: alreadyRated } }, { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }, { new: true });
        }
        else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id
                    }
                }
            }, { new: true });
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRatings = getAllRatings.ratings.length;
        let sumOfRatings = getAllRatings.ratings.map((item) => item.star).reduce((prev, cur) => prev + cur, 0);
        let actualRating = Math.round(sumOfRatings / totalRatings);
        let finalProduct = await Product.findByIdAndUpdate(prodId, { totalRatings: actualRating }, { new: true });
        res.json(finalProduct);
    } catch (error) {
        // Handle errors
        throw new Error(error);
    }

});



const uploadImages =asyncHandler( async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
// sourcery skip: use-object-destructuring
        const files  = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath.url)
            console.log(newpath);
            /*try {
                fs.unlinkSync(path);
              } catch (error) {
                console.error(error);
              }*/
        };
        const images =  urls.map((file) => { return file })
        res.json(images);
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
    }
});


const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({ message: "Deleted" });
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages };
