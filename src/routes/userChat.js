import { Router } from 'express';

import UserChatController from '../controllers/userChatController.js';
import { verifyUser } from '../middlewares/authentication.js';

const userChatRouter = Router();

// userChatRouter.use(verifyUser);
userChatRouter.post('/', UserChatController.addNewTextMessage);
userChatRouter.post('/audio', UserChatController.addNewAudioMessage);

export default userChatRouter;