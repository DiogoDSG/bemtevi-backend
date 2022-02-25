import express from 'express';
import { auth } from '../middleware/auth.js';
import { postValidation } from '../middleware/validate-post.js';

import commentController from "../controller/comment-controller.js"

const router = new express.Router();

router.post("/add/:postId", auth, postValidation, commentController.createComment)
router.get("/:postId", auth, postValidation, commentController.getAllPostComments)

export default router