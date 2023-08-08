import openAiApiInstance from '../../config/open-ai/open-ai.js';
import { info } from '../logger/logger.js';

const moduleName = 'ChatGPT API';

/**
 * Get ChatGPT chat completion with previous chat messages context
 * @param {*} userInput
 * @param {*} messagesContext
 */
export async function createChatCompletionWithChatGpt(userInput, messagesContext = []) {
  // TODO! Check whether we need to add limit on tokens

  // Add latest user input
  messagesContext.push({ role: 'user', content: userInput });

  try {
    const start = performance.now();
    const completion = await openAiApiInstance.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messagesContext
    });
    const end = performance.now();

    info(`createChatCompletion execution time: ${end - start} ms`, moduleName)

    // Get completion text/content
    const completionText = completion.data.choices[0].message.content;

    return completionText;
  } catch (error) {
    // console.log(error)

    return 'Error creating chat completion';
  }
}
