import 'dotenv/config'
import express from 'express';
import multer from 'multer';

import UserChatController from './controllers/userChatController.js';

const app = express();
// Default port is 3000, but it can be changed by setting PORT env variable
const PORT = process.env.PORT || 3000;
// const upload = multer({ dest: os.tmpdir() });

app.use(express.json())
app.use(multer().any())
app.post('/', UserChatController.addNewTextMessage);
app.post('/audio', UserChatController.addNewAudioMessage);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
