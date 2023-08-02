import { createUserChatForUser, deleteUserChatById, addUserChatMessage } from '../../persistence/firestore/userChat.js';

/**
 * Available roles for ChatGPT messages
 */
const messageRoles = {
  user: 'user',
  assistant: 'assistant'
};

/**
 * Create new user chat
 * @param {*} userId
 * @returns
 */
export async function createNewUserChat(userId) {
  return await createUserChatForUser(userId);
}

/**
 * Delete user chat
 * @param {*} userId
 * @returns
 */
export async function deleteUserChat(userId, chatId) {
  return await deleteUserChatById(userId, chatId);
}

/**
 * Add message to user chat with user role
 * @param {*} userId
 * @param {*} chatId
 * @param {*} userMessageText
 * @returns
 */
export async function addUserMessageToUserChat(userId, chatId, userMessageText) {
  const userMessageObject = {
    role: messageRoles.user,
    content: userMessageText
  };

  return await addUserChatMessage(userId, chatId, userMessageObject);
}

/**
 * Add message to user chat with assistant role
 * @param {*} userId
 * @param {*} chatId
 * @param {*} userMessageText
 * @returns
 */
export async function addChatGptAssistantMessageToUserChat(userId, chatId, chatGptAssistantMessageText) {
  const chatGptAssistantMessageObject = {
    role: messageRoles.assistant,
    content: chatGptAssistantMessageText
  };

  return await addUserChatMessage(userId, chatId, chatGptAssistantMessageObject);
}

/**
 * Get all user's chats
 * @param {*} userChatId
 * @returns
 */
export async function getUserChatHistory(userChatId) {
  return [];
}
