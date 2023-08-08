import openAiApiInstance from '../../config/open-ai/open-ai.js';
import { createChatCompletionWithChatGpt } from '../chatgpt/chatgpt.js';
import { info } from '../logger/logger.js';

const moduleName = 'Whisper API';

export async function transcribeAudio(file) {
  const start = performance.now();
  const transcript = await openAiApiInstance.createTranscription(file, 'whisper-1');
  const end = performance.now();

  info(`createTranscription execution time: ${end - start} ms`, moduleName);

  return transcript.data.text;
}

/**
 * Get ChatGPT chat completion with previous chat messages context
 * @param {*} userInput
 * @param {*} messagesContext
 */
export async function processAudioFileChatCompletionWithChatGpt(file, messagesContext = []) {
  const transcribedText = transcribeAudio(file);

  return createChatCompletionWithChatGpt(transcribedText, messagesContext);
}
