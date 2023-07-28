import openAiApiInstance from '../../config/open-ai.js';
import { createChatCompletionWithChatGpt } from '../chatgpt/chatgpt.js';

export async function transcribeAudio(file) {
  const transcript = await openAiApiInstance.createTranscription(
    file,
    "whisper-1"
  );
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