import { Router } from 'express';

import UserController from '../controllers/userController.js';
import { verifyUser } from '../middlewares/authentication.js';

const userRouter = Router();

userRouter.delete('/user', verifyUser, UserController.deleteUser);

export default userRouter;