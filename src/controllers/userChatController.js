import { Readable } from 'stream';

import UserChatTextMessage from '../domain/userChatTextMessage.js';
import { transcribeAudio } from '../services/whisper/whisper.js';
import {
  createNewUserChat,
  deleteUserChat,
  addNewTextMessageToUserChat
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
    const result = await addNewTextMessageToUserChat(uid, userChatTextMessage)

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
    const { userChatId } = req.body;
    const file = req.files[0];
    const audioReadStream = Readable.from(file.buffer);
    // OpenAI WhisperAPI is hacking around MIME type and is sensitive for file extension, so we need to add .path attribute
    // To stream object, because Readable.from() does not have whereas fs.createReadStream() has it
    // Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm
    audioReadStream.path = 'file.mp3';

    const result = await transcribeAudio(audioReadStream);

    res.status(200).send(result);
  }
}
