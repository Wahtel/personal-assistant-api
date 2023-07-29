import fs from 'fs';
import { Readable } from 'stream';

import UserChatTextMessage from '../domain/userChatTextMessage.js';
import { getUserChatHistory } from '../services/userChat/userChat.js';
import { createChatCompletionWithChatGpt } from '../services/chatgpt/chatgpt.js';
import { transcribeAudio } from '../services/whisper/whisper.js';
import { firebaseAuth, firebaseFirestore } from '../config/firebase/firebase.js';

/**
 * Controller for handling all interactions with the chat
 */
export default class UserChatController {
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
    const userChatHistory = await getUserChatHistory(userChatTextMessage.userChatId);
    const result = await createChatCompletionWithChatGpt(userChatTextMessage.userInput, userChatHistory);
    const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYyM2YzNmM4MTZlZTNkZWQ2YzU0NTkyZTM4ZGFlZjcyZjE1YTBmMTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGVyc29uYWwtYXNzaXN0YW50LTU2MjM2IiwiYXVkIjoicGVyc29uYWwtYXNzaXN0YW50LTU2MjM2IiwiYXV0aF90aW1lIjoxNjkwNTY1OTcwLCJ1c2VyX2lkIjoiWVVqNDBGaWtINmN5ODlYRk1hNzNvbG5iQ1E3MiIsInN1YiI6IllVajQwRmlrSDZjeTg5WEZNYTczb2xuYkNRNzIiLCJpYXQiOjE2OTA1NjU5NzIsImV4cCI6MTY5MDU2OTU3MiwiZW1haWwiOiJ0ZXN0dXNlckBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdHVzZXJAZW1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.XUe-CAqtxrxCOy5AwB3rrNG5o49_VM1nzZMPXAVAwAG1zLns8zUtQ1K_lIcHwjcyv064gUDqiKPtV8YJntWlsHIxUcJCZp5etkYy7aGqq7JcVCuR75ah9chdjhnwMxkVPzZQ_eGTQmYNQa7KtaQfsI9LC47lKNhCu3oORHjjHEFXt7IveyU0TjbqIafHe8ehpMJkMRsHWPjNQzNt19i-EKCenQFjocWc8fwDOBAPtIYi33Zbp9BHmeCGyef22cOc1HS1B_O-oCzwQJs542_ZQiqjqNbgFm8ysYmwQLpHSJtLKAh7NYNqpPIl_R4lzOdGLcEcIJoTbOqrBQ3ZL0Brrw'

    // firebaseAuth
    //   .verifyIdToken(idToken)
    //   .then(async (decodedToken) => {
    //     const uid = decodedToken.uid;

    //     console.log('uid: ', uid);
        
    //     const docRef = firebaseFirestore.collection('users').doc('alovelace').collection('chats').doc('chat-1').collection('messages').doc('message-3');

    //     await docRef.set({
    //       first: 'user',
    //       last: 'What is the capital of US?',
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //   });

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
