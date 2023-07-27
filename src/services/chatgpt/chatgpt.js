import openAiApiInstance from '../../config/open-ai.js';

/**
 * Get ChatGPT chat completion with previous chat messages context
 * @param {*} userInput
 * @param {*} messagesContext
 */
export async function createChatCompletionWithChatGpt(userInput, messagesContext = []) {
  // TODO! Add limit on tokens number

  // Add latest user input
  messagesContext.push({ role: 'user', content: userInput });

  try {
    const completion = await openAiApiInstance.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messagesContext
    });
    // Get completion text/content
    const completionText = completion.data.choices[0].message.content;

    return completionText;
  } catch (error) {
    // console.log(error)

    return 'error'
  }


}
