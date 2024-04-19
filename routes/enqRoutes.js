const express = require('express');
const { createEnquiry, updateEnquiry, getEnquiry, getAllEnquiry, deleteEnquiry} = require('../controller/enqControl');
const {authMiddleWare, isAdmin }= require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/',authMiddleWare,isAdmin, createEnquiry);
router.put('/:id',authMiddleWare,isAdmin, updateEnquiry);
router.get('/:id',authMiddleWare,isAdmin, getEnquiry);
router.get('/',authMiddleWare,isAdmin, getAllEnquiry);
router.delete('/:id',authMiddleWare,isAdmin, deleteEnquiry);

module.exports = router;