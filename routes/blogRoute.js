const express = require('express');
const router = express.Router();
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleWare');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, uploadImages, deleteImages } = require('../controller/blogControl');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImg');

// Route for creating a new blog post
router.post('/', authMiddleWare, isAdmin, createBlog);

router.put('/upload/', authMiddleWare, isAdmin, uploadPhoto.array("images", 10),
blogImgResize ,
uploadImages);

router.delete('/delete/:id', authMiddleWare, isAdmin, deleteImages );
// Route for handling 'like' functionality of a blog post
router.put('/likes', authMiddleWare, likeBlog);

// Route for handling 'dislike' functionality of a blog post
router.put('/dislikes', authMiddleWare, dislikeBlog);

// Route for updating an existing blog post by ID
router.put('/:id', authMiddleWare, isAdmin, updateBlog);

// Route for getting a specific blog post by ID
router.get('/:id', getBlog);

// Route for getting all blog posts
router.get('/', getAllBlogs);

// Route for deleting a blog post by ID
router.delete('/:id', authMiddleWare, isAdmin, deleteBlog);

// Export the router to be used in the main application
module.exports = router;
