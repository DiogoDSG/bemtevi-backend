import express from 'express';
import User from '../model/user.js';
import { auth } from '../middleware/auth.js';

import userController from '../controller/user-controller.js';

const router = new express.Router();

router.get('/current', auth, userController.getCurrentUser);

router.get('/:id', userController.getUserById);

router.post('/signup', userController.createUser);

router.post('/login', userController.loginUser);

router.post('/logout', auth, userController.logoutUser);

export default router;
