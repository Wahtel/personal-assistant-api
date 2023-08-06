import { to } from 'await-to-js';

import * as logger from '../logger/logger.js';
import textToSpeechClient from '../../config/google-cloud/text-to-speech/text-to-speech.js';

const moduleName = 'Google Cloud Text-to-Speech';
// Default settings for Google Cloud Text-to-Speech AI voice
const defaultVoiceObject = {
  languageCode: 'en-US',
  ssmlGender: 'MALE'
};

/**
 * Synthesize speech via Google Cloud Text-to-Speech API and return base64 of mp3 file
 * @param {*} inputText
 * @param {*} voiceObject
 * @returns
 */
export async function synthesizeSpeechViaGoogleCloudApi(inputText, voiceObject = defaultVoiceObject) {
  const request = {
    // The text to synthesize
    input: {
      text: inputText
    },
    // The language code and SSML Voice Gender
    voice: voiceObject,
    // The audio encoding type
    audioConfig: {
      audioEncoding: 'MP3'
    }
  };
  const [err, response] = await to(textToSpeechClient.synthesizeSpeech(request));

  if (err) {
    logger.critical(
      `Error while synthesize speech using Google Cloud Text-to-Speech API: ${logger.inspect(err)}`,
      moduleName
    );

    // Return empty base64 string
    return '';
  }

  const audioContent = response[0]?.['audioContent'];

  if (!audioContent) {
    logger.critical(
      `Failed to get audio content using Google Cloud Text-to-Speech API: ${logger.inspect(err)}`,
      moduleName
    );

    // Return empty base64 string
    return '';
  }

  const audioBuffer = Buffer.from(audioContent);

  return audioBuffer.toString('base64');
}
