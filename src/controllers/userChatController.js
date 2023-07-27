import UserChatTextMessage from "../domain/userChatTextMessage.js";
import { getUserChatHistory } from "../services/userChat/userChat.js";
import { createChatCompletionWithChatGpt } from '../services/chatgpt/chatgpt.js'
/**
 * Controller for handling all interactions with the chat
 */
export default class UserChatController {
  /**
   * Method for handling adding new text message in user text and getting response from the ChatGPT based on chat 
   * History and a new user input
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async addNewTextMessage(req, res) {
    const { userChatId, userInput } = req.body;
    const userChatTextMessage = new UserChatTextMessage(userChatId, userInput);
    const userChatHistory = await getUserChatHistory(userChatTextMessage.userChatId);
    const result = await createChatCompletionWithChatGpt(userChatTextMessage.userInput, userChatHistory);

    res.status(200).send(result);
  }
}