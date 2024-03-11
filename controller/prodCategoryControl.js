const ProdCategory = require("../models/prodCategoryModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/ValidateMongodbId');

const createCategory = asyncHandler(async (req, res) => {
    try{
        const newProdCategory = await ProdCategory.create(req.body);
        res.json(newProdCategory);
    }
    catch(error){
        throw new Error(error)
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedProdCategory = await ProdCategory.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedProdCategory);
    }
    catch(error){
        throw new Error(error)
    }
});
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory = await ProdCategory.findByIdAndDelete(id);
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
        const category = await ProdCategory.findById(id);
        res.json({category});
    }
    catch(error){
        throw new Error(error)
    }
});

const getAllCategories = asyncHandler(async (req, res) => {
    try{
        const Categories = await ProdCategory.find();
        res.json({Categories});
    }
    catch(error){
        throw new Error(error)
    }
});

module.exports = {createCategory,updateCategory, deleteCategory, getAllCategories, getCategory}