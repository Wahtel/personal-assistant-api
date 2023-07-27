/**
 * Class representing UserChatTextMessage entity for the chat
 */
export default class UserChatTextMessage {
  /**
   * Unique identifier of the chat
   */
  userChatId = null;

  /**
   * User text message input
   */
  userInput = null;

  constructor(userChatId, userInput) {
    this.userChatId = userChatId;
    this.userInput = userInput
  }
}