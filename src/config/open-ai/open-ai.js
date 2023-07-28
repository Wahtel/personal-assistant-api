import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai';

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAiApiInstance = new OpenAIApi(openAiConfiguration);

export default openAiApiInstance;
