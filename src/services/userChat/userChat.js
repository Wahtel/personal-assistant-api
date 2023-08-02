import {
  createUserChatForUser,
  deleteUserChatById,
  addUserChatMessage,
  getUserChatMessages
} from '../../persistence/firestore/userChat.js';
import { createChatCompletionWithChatGpt } from '../chatgpt/chatgpt.js';

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
 * Service method for UserChatController.addNewTextMessage controller method which adds user text message to
 * The chat, generate ChatGPT response, add this response to chat and return response back to user
 * @param {} userId
 * @param {*} userChatTextMessage
 * @returns
 */
export async function addNewTextMessageToUserChat(userId, userChatTextMessage) {
  const userChatHistory = await getUserChatHistory(userId, userChatTextMessage.userChatId);
  const [chatGptCompletion] = await Promise.all([
    createChatCompletionWithChatGpt(userChatTextMessage.userInput, userChatHistory),
    addUserMessageToUserChat(userId, userChatTextMessage.userChatId, userChatTextMessage.userInput)
  ]);

  await addChatGptAssistantMessageToUserChat(userId, userChatTextMessage.userChatId, chatGptCompletion);

  const result = {
    completion: chatGptCompletion
  };

  return result;
}

/**
 * Add message to user chat with user role
 * @param {*} userId
 * @param {*} chatId
 * @param {*} userMessageText
 * @returns
 */
async function addUserMessageToUserChat(userId, chatId, userMessageText) {
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
async function addChatGptAssistantMessageToUserChat(userId, chatId, chatGptAssistantMessageText) {
  const chatGptAssistantMessageObject = {
    role: messageRoles.assistant,
    content: chatGptAssistantMessageText
  };

  return await addUserChatMessage(userId, chatId, chatGptAssistantMessageObject);
}

/**
 * Get user chat history for ChatGPT completion context
 * @param {*} userChatId
 * @returns
 */
async function getUserChatHistory(userId, userChatId) {
  const messagesObjects = await getUserChatMessages(userId, userChatId);
  const userChatHistory = messagesObjects.map(({ role, content }) => ({
    role,
    content
  }));

  return userChatHistory;
}
