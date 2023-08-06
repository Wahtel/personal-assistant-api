import { Router } from 'express';

import UserChatController from '../controllers/userChatController.js';
import { verifyUser } from '../middlewares/authentication.js';

const userChatRouter = Router();

userChatRouter.post('/chat', verifyUser, UserChatController.createNewUserChat);
userChatRouter.get('/chat', verifyUser, UserChatController.getAllUserChats);
userChatRouter.get('/chat/:id', verifyUser, UserChatController.getUserChatHistory);
userChatRouter.delete('/chat/:id', verifyUser, UserChatController.deleteUserChat);
userChatRouter.post('/chat/message', verifyUser, UserChatController.addNewTextMessage);
userChatRouter.post('/chat/audio-message', verifyUser, UserChatController.addNewAudioMessage);
userChatRouter.post('/chat/synthesize', verifyUser, UserChatController.synthesizeUserChatMessage);

export default userChatRouter;