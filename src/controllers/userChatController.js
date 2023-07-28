import fs from 'fs';
import { Readable } from 'stream';

import UserChatTextMessage from '../domain/userChatTextMessage.js';
import { getUserChatHistory } from '../services/userChat/userChat.js';
import { createChatCompletionWithChatGpt } from '../services/chatgpt/chatgpt.js';
import { transcribeAudio } from '../services/whisper/whisper.js';
import { firebaseAuth } from '../config/firebase/firebase.js';

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
    const { userChatId, userInput } = req.body;
    const userChatTextMessage = new UserChatTextMessage(userChatId, userInput);
    const userChatHistory = await getUserChatHistory(userChatTextMessage.userChatId);
    const result = await createChatCompletionWithChatGpt(userChatTextMessage.userInput, userChatHistory);
    const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYyM2YzNmM4MTZlZTNkZWQ2YzU0NTkyZTM4ZGFlZjcyZjE1YTBmMTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGVyc29uYWwtYXNzaXN0YW50LWRldmVsb3BtZW50IiwiYXVkIjoicGVyc29uYWwtYXNzaXN0YW50LWRldmVsb3BtZW50IiwiYXV0aF90aW1lIjoxNjkwNTYyNzAxLCJ1c2VyX2lkIjoiUk5URHdLejVraGUwTFkwYWJsMWxoSnVhYzVzMiIsInN1YiI6IlJOVER3S3o1a2hlMExZMGFibDFsaEp1YWM1czIiLCJpYXQiOjE2OTA1NjMyMDAsImV4cCI6MTY5MDU2NjgwMCwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QGVtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.KcxH3bA5hkvZKWfQn46SU0tmOrlmdp_QcYSdEzWgPGt1qXz5Rp5woUozMXB_9v5rKlcpph0LWiXrMFR4MZ_YH5wsw51HxtlygdTOUiFL8SxApT4vLq6Od0uVCg4R-3ZeSWVg69rjCdkWSfENhLiWd0gp5HC8zACtagyi47Msatg1Wvw0dbZgAwoy8Ogu9dPP8MGqi9BohJpDIwwA7-nBQqAcwOWnTmBHIo4Sv-5W2ca7lgplbTAmhmziNNeNRHMlVlhbtlDLMSGVrcDo7ywWqOQ-8q2eSO5L1kE75Pzz6muJXCiXPvepYYYSFdB9FJqH_pPxzwxE6gstQ6jGIYE_8g'

    firebaseAuth
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;

        console.log(uid)
      })
      .catch((error) => {
        console.error(error)
      });

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
