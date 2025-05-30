const express = require('express');
const postController = require('../Controllers/postController');
const { protect } = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const router = express.Router();

// Public routes
router.get('/', postController.getPosts);

// Create new post route
router.post('/', protect, postController.uploadPostImage, postController.createPost);

// Place specific routes BEFORE parameter routes
router.get('/my-posts', protect, postController.getMyPosts);
router.get('/bookmarked', protect, postController.getBookmarks);  // Keep only one bookmarks route

// Post routes with ID parameter
router.get('/:id', protect, postController.getPost);
router.patch('/:id', protect, postController.uploadPostImage, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

// Post interaction routes
router.post('/:postId/bookmark', protect, postController.toggleBookmark);
// Remove this duplicate route
// router.get('/bookmarked', protect, postController.getBookmarks);
router.post('/:id/comments', protect, postController.createComment);
router.delete('/:postId/comments/:commentId', protect, postController.deleteComment);
router.post('/:postId/like', protect, postController.toggleLike);
router.get('/:postId/likes', postController.getLikes);

// Comment routes
router.patch('/:postId/comments/:commentId', protect, postController.updateComment);
router.post('/:postId/comments/:commentId/replies', protect, postController.addReply);
router.patch('/:postId/comments/:commentId/replies/:replyId', protect, postController.updateReply);
router.delete('/:postId/comments/:commentId/replies/:replyId', protect, postController.deleteReply);

module.exports = router;