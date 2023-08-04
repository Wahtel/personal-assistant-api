import UserChatTextMessage from '../domain/userChatTextMessage.js';
import {
  createNewUserChat,
  deleteUserChat,
  addNewTextMessageToUserChat,
  addNewAudioMessageToUserChat,
  getUserChats,
  getUserChatHistoryMessages
} from '../services/userChat/userChat.js';
import { badRequest } from '../services/error/handler.js';

/**
 * Controller for handling all interactions with the chat
 */
export default class UserChatController {
  /**
   * Create new user chat and return id of newly created user chat
   * @param {*} req
   * @param {*} res
   */
  static async createNewUserChat(req, res) {
    const { uid } = req;
    const chatId = await createNewUserChat(uid);
    const result = { chatId };

    res.status(200).send(result);
  }

  /**
   * Delete user chat and return its id
   * @param {*} req
   * @param {*} res
   */
  static async deleteUserChat(req, res) {
    const { uid } = req;
    const { id } = req.params;

    if (!id) return badRequest('No chatId provided');

    await deleteUserChat(uid, id);
    res.status(200).send('OK');
  }

  /**
   * Method for handling adding new text message in user chat and getting response from the ChatGPT based on chat
   * History and a new user input
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addNewTextMessage(req, res) {
    const { uid } = req;
    const { userChatId, userInput } = req.body;
    const userChatTextMessage = new UserChatTextMessage(userChatId, userInput);
    const chatGptCompletion = await addNewTextMessageToUserChat(uid, userChatTextMessage);
    const result = {
      completion: chatGptCompletion
    };

    res.status(200).send(result);
  }

  /**
   * Method for handling adding new audio message to the chat, transcribing audio and getting ChatGPT based on chat
   * History and transcribed text
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async addNewAudioMessage(req, res) {
    const { uid } = req;
    const { userChatId } = req.body;
    const file = req.files[0];
    const result = await addNewAudioMessageToUserChat(file, uid, userChatId);

    res.status(200).send(result);
  }

  /**
   * Method for getting all user chats by userId from Authorization token
   * @param {*} req
   * @param {*} res
   */
  static async getAllUserChats(req, res) {
    const { uid } = req;
    const chats = await getUserChats(uid);

    res.status(200).send(chats);
  }

  /**
   * Method for getting user chat history: all message in ascensing order (older messages go first like in all chats)
   * @param {*} req
   * @param {*} res
   */
  static async getUserChatHistory(req, res) {
    const { uid } = req;
    const { id: chatId } = req.params;
    const userChatMessages = await getUserChatHistoryMessages(uid, chatId)

    res.status(200).send(userChatMessages);
  }
}
