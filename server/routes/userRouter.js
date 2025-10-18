import express from 'express';
import { signup, login, checkAuth } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/check', protectRoute, checkAuth);

export default userRouter;