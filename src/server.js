import 'dotenv/config'
import express from 'express';

import UserChatController from './controllers/userChatController.js';

const app = express();
// Default port is 3000, but it can be changed by setting PORT env variable
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.post('/', UserChatController.addNewTextMessage);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
