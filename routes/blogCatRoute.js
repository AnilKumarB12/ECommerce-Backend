const express = require('express');
const { createCategory, updateCategory,getAllCategories, getCategory, deleteCategory} = require('../controller/blogCatControl');
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/',authMiddleWare,isAdmin, createCategory);
router.put('/:id',authMiddleWare,isAdmin, updateCategory);
router.get('/:id',authMiddleWare,isAdmin, getCategory);
router.get('/',authMiddleWare,isAdmin, getAllCategories);
router.delete('/:id',authMiddleWare,isAdmin, deleteCategory);

module.exports = router;