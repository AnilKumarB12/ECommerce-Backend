const express = require('express');
const { createBrand, updateBrand, getBrand, getAllBrand, deleteBrand} = require('../controller/brandControl');
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/',authMiddleWare,isAdmin, createBrand);
router.put('/:id',authMiddleWare,isAdmin, updateBrand);
router.get('/:id',authMiddleWare,isAdmin, getBrand);
router.get('/',authMiddleWare,isAdmin, getAllBrand);
router.delete('/:id',authMiddleWare,isAdmin, deleteBrand);

module.exports = router;