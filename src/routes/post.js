import express from 'express';
import { auth } from '../middleware/auth.js';
import { postValidation } from '../middleware/validate-post.js';

import postController from '../controller/post-controller.js';

const router = new express.Router();

router.post('/add', auth, postController.createPost);

router.get('/all', auth, postController.getAllPosts);

router.get('/:id', auth, postController.getPostsByUserId);

router.patch('/like/:postId', auth, postValidation, postController.likePost);

router.patch('/dislike/:postId', auth, postValidation, postController.dislikePost);

router.delete('/delete/:postId', auth, postValidation, postController.removePost)

export default router;
