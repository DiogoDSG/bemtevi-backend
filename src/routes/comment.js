import express from 'express';
import { auth } from '../middleware/auth.js';
import { postValidation } from '../middleware/validate-post.js';

import commentController from "../controller/comment-controller.js"

const router = new express.Router();

router.post("/add", auth, postValidation, commentController.createComment)
router.get("/all", auth, postValidation, commentController.getAllPostComments)
router.delete("/delete/:commentId", auth, postValidation, commentController.removeComment)

export default router