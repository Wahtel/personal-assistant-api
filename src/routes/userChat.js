import { Router } from 'express';

import UserChatController from '../controllers/userChatController.js';
import { verifyUser } from '../middlewares/authentication.js';

const userChatRouter = Router();

userChatRouter.post('/', verifyUser, UserChatController.addNewTextMessage);
userChatRouter.post('/audio', verifyUser, UserChatController.addNewAudioMessage);

export default userChatRouter;