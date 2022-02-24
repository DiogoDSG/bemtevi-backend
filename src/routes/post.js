import express from 'express';
import { auth } from '../middleware/auth.js';

import postController from '../controller/post-controller.js';

const router = new express.Router();

router.post('/add', auth, postController.createPost);

router.get('/all', auth, postController.getAllPosts);

router.get('/:id', auth, postController.getPostsByUserId);

router.patch('/like/:id', auth, postController.likePost);

router.patch('/dislike/:id', auth, postController.dislikePost);

export default router;
