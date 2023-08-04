import { FieldValue } from 'firebase-admin/firestore';

import { firebaseFirestore } from '../../config/firebase/firebase.js';
import { deleteCollection } from './helpers.js';

/**
 * Initial value for user chat title
 */
const INITIAL_USERCHAT_TITLE = 'New chat';

/**
 * Create new user chat with auto-generated id and return this id
 * @param {*} userId
 * @returns
 */
export async function createUserChatForUser(userId) {
  const res = await firebaseFirestore.collection('users').doc(userId).collection('chats').add({
    title: INITIAL_USERCHAT_TITLE,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  const chatId = res.id;

  return chatId;
}

/**
 * Delete user chat by id and return this id
 * @param {*} userId
 * @returns
 */
export async function deleteUserChatById(userId, chatId) {
  // Path to the chat document
  const chatDocumentPath = `users/${userId}/chats/${chatId}`;
  // Path to collection of messages in provided chat
  const messagesCollectionPath = `${chatDocumentPath}/messages`;

  await deleteCollection(firebaseFirestore, messagesCollectionPath, 10);
  await firebaseFirestore.doc(chatDocumentPath).delete();
}

/**
 * Add new message to user chat
 * @param {*} userId
 * @param {*} chatId
 * @param {*} message
 * @returns
 */
export async function addUserChatMessage(userId, chatId, messageObject) {
  const [res] = await Promise.all([
    firebaseFirestore
      .collection('users')
      .doc(userId)
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({ ...messageObject, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }),
    updateUserChatUpdateAtProperty(userId, chatId),
    setUserChatTitle(userId, chatId, messageObject?.content || INITIAL_USERCHAT_TITLE)
  ]);
  const messageId = res.id;

  return messageId;
}

/**
 * Update user chat updatedAt property to current timestamp
 * @param {*} userId
 * @param {*} chatId
 */
export async function updateUserChatUpdateAtProperty(userId, chatId) {
  const chatRef = await firebaseFirestore.collection('users').doc(userId).collection('chats').doc(chatId);

  await chatRef.update({
    updatedAt: FieldValue.serverTimestamp()
  });
}

/**
 * Set user chat title property
 * @param {*} userId
 * @param {*} chatId
 */
export async function setUserChatTitle(userId, chatId, title) {
  const chatRef = await firebaseFirestore.collection('users').doc(userId).collection('chats').doc(chatId);

  await chatRef.update({
    title
  });
}

/**
 * Get all messages in user chat
 * @param {*} userId
 * @param {*} chatId
 * @returns
 */
export async function getUserChatMessages(userId, chatId) {
  const messagesRef = firebaseFirestore
    .collection('users')
    .doc(userId)
    .collection('chats')
    .doc(chatId)
    .collection('messages');
  const messagesSnapshot = await messagesRef.orderBy('createdAt', 'asc').get();
  // .get() returns something array-like so we need to use .docs to apply map to this object
  // console.log(Array.from(messagesSnapshot))
  const messages = messagesSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });

  return messages;
}

/**
 * Return all user's chats sorted by updatedAt in descending order (newest first)
 * @returns 
 */
export async function getUserChatsByUserId(userId) {
  const chatsRef = firebaseFirestore
    .collection('users')
    .doc(userId)
    .collection('chats')
  const chatsSnapshot = await chatsRef.orderBy('updatedAt', 'desc').get();
  // .get() returns something array-like so we need to use .docs to apply map to this object
  // console.log(Array.from(messagesSnapshot))
  const chats = chatsSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });

  return chats;
}
