const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/ValidateMongodbId');

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id }  = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id , req.body, { new: true, });
        res.json(updatedProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id }  = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.json(deletedProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    
    try {
        //Filter products
        const queryObject = { ...req.query };
        const excludeFields  = ['page', 'sort','limit','fields'];
        excludeFields.forEach((field) => delete queryObject[field]);
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryString));

        //Sorting products
        if (req.query.sort) {
            const sort = req.query.sort.split(',').join(' ');
            query = query.sort(sort);
        }
        else {
            query = query.sort('-createdAt')
        }

        // limit the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else{
            query = query.select('-__v');
        }

        // Pagination
        const { page, limit  }= req.query;
        const skip  = (page-1)*limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>= productCount) {throw new Error('this page does not exist')}
        }
        const product = await query;
       
        res.json(product);
    }
    catch (error) {
        throw new Error(error);
    }
});







module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct};