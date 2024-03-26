const brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/ValidateMongodbId');

const createBrand = asyncHandler(async (req, res) => {
    try{
        const newBrand = await brand.create(req.body);
        res.json(newBrand);
    }
    catch(error){
        throw new Error(error)
    }
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updatedBrand = await brand.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updatedBrand);
    }
    catch(error){
        throw new Error(error)
    }
});
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deletedBrand = await brand.findByIdAndDelete(id);
        res.json({deletedBrand});
    }
    catch(error){
        throw new Error(error)
    }
});

const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getABrand = await brand.findById(id);
        res.json({getABrand});
    }
    catch(error){
        throw new Error(error)
    }
});

const getAllBrand = asyncHandler(async (req, res) => {
    try{
        const brands = await brand.find();
        res.json({brands});
    }
    catch(error){
        throw new Error(error)
    }
});

module.exports = {createBrand, updateBrand, deleteBrand, getAllBrand, getBrand}