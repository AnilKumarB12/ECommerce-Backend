const express = require('express');
const { createColor, updateColor, getColor, getAllColor, deleteColor} = require('../controller/colorControl');
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/',authMiddleWare,isAdmin, createColor);
router.put('/:id',authMiddleWare,isAdmin, updateColor);
router.get('/:id',authMiddleWare,isAdmin, getColor);
router.get('/',authMiddleWare,isAdmin, getAllColor);
router.delete('/:id',authMiddleWare,isAdmin, deleteColor);

module.exports = router;