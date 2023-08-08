import { to } from 'await-to-js';

import * as logger from '../logger/logger.js';
import textToSpeechClient from '../../config/google-cloud/text-to-speech/text-to-speech.js';
import { critical } from '../error/handler.js';
import { info } from '../logger/logger.js';

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
    voice: voiceObject || defaultVoiceObject,
    // The audio encoding type
    audioConfig: {
      audioEncoding: 'MP3'
    }
  };

  const start = performance.now();
  const [err, response] = await to(textToSpeechClient.synthesizeSpeech(request));
  const end = performance.now();

  info(`synthesizeSpeech execution time: ${end - start} ms`, moduleName);

  if (err) {
    logger.critical(
      `Error while synthesize speech using Google Cloud Text-to-Speech API: ${logger.inspect(err)}`,
      moduleName
    );

    return [critical('Error while synthesize speech using Google Cloud Text-to-Speech API')]
  }

  const audioContent = response[0]?.['audioContent'];

  if (!audioContent) {
    logger.critical(
      `Failed to get audio content using Google Cloud Text-to-Speech API: ${logger.inspect(err)}`,
      moduleName
    );

    return [critical('Error while synthesize speech using Google Cloud Text-to-Speech API')]

  }

  const audioBuffer = Buffer.from(audioContent);
  const result = audioBuffer.toString('base64')

  return [null, result];
}
