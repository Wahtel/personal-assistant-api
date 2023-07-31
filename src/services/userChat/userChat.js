import { createUserChatForUser, deleteUserChatById } from "../../persistence/firestore/userChat.js";

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
 * Get all user's chats
 * @param {*} userChatId 
 * @returns 
 */
export async function getUserChatHistory(userChatId) {
  return []
}