const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/ProductControl');
const { isAdmin, authMiddleWare } = require('../middlewares/authMiddleWare');
const router  = express.Router();
isAdmin

router.post('/', authMiddleWare, isAdmin, createProduct);
router.get('/:id', getProduct);
router.put('/:id', authMiddleWare, isAdmin, updateProduct);
router.delete('/:id',authMiddleWare, isAdmin,  deleteProduct);
router.get('/', getAllProducts);



module.exports =router;