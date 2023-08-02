import { FieldValue } from 'firebase-admin/firestore';

import { firebaseFirestore } from '../../config/firebase/firebase.js';
import { deleteCollection } from './helpers.js';

/**
 * Create new user chat with auto-generated id and return this id
 * @param {*} userId
 * @returns
 */
export async function createUserChatForUser(userId) {
  const res = await firebaseFirestore
    .collection('users')
    .doc(userId)
    .collection('chats')
    .add({ createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  const chatId = res.id;

  // const res = await docRef.update({
  //   timestamp: FieldValue.serverTimestamp()
  // });

  return chatId;
}

/**
 * Delete user chat by id and return this id
 * @param {*} userId
 * @returns
 */
export async function deleteUserChatById(userId, chatId) {
  // Path to the chat document
  const chatDocumentPath = `users/${userId}/chats/${chatId}`
  // Path to collection of messages in provided chat
  const messagesCollectionPath = `${chatDocumentPath}/messages`;

  await deleteCollection(firebaseFirestore, messagesCollectionPath, 10);
  await firebaseFirestore.doc(chatDocumentPath).delete();
}
