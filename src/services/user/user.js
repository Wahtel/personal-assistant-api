import { to } from 'await-to-js';

import * as logger from '../logger/logger.js'
import { critical } from '../error/handler.js';
import { firebaseAuth } from "../../config/firebase/firebase.js";
import { getUserChatsByUserId } from '../../persistence/firestore/userChat.js';
import { deleteUserChatById } from '../../persistence/firestore/userChat.js';

const moduleName = 'User Service'

export async function deleteFirebaseUser(userId) {
  const [deleteUserErr] = await to(firebaseAuth.deleteUser(userId));

  if (deleteUserErr) {
    logger.critical(`Error while deleting firebase user with id ${userId}: ${logger.inspect(deleteUserErr)}`, moduleName);

    return [critical(`Error while deleting firebase user with id ${userId}`)]
  }

  const userChats = await getUserChatsByUserId(userId);
  const userChatsIds = userChats.map(({ id }) => id);
  const userChatsDeletionPromises = userChatsIds.map(async (chatId) => await deleteUserChatById(userId, chatId));

  const [deleteUserChatsErr] = await to(Promise.all(userChatsDeletionPromises));

  if (deleteUserChatsErr) {
    logger.critical(`Error while deleting user's with id ${userId} chats: ${logger.inspect(deleteUserChatsErr)}`, moduleName);

    return [critical(`Error while deleting user's with id ${userId} chats`)]
  }

  return [null, 'OK']
}