const blogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/ValidateMongodbId');

const createCategory = asyncHandler(async (req, res) => {
    try{
        const newBlogCategory = await blogCategory.create(req.body);
        res.json(newBlogCategory);
    }
    catch(error){
        throw new Error(error)
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedBlogCategory = await blogCategory.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedBlogCategory);
    }
    catch(error){
        throw new Error(error)
    }
});
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory = await blogCategory.findByIdAndDelete(id);
        res.json({deletedCategory});
    }
    catch(error){
        throw new Error(error)
    }
});

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const category = await blogCategory.findById(id);
        res.json({category});
    }
    catch(error){
        throw new Error(error)
    }
});

const getAllCategories = asyncHandler(async (req, res) => {
    try{
        const Categories = await blogCategory.find();
        res.json({Categories});
    }
    catch(error){
        throw new Error(error)
    }
});

module.exports = {createCategory,updateCategory, deleteCategory, getAllCategories, getCategory}