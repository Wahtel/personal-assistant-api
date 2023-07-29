import 'dotenv/config'
import express from 'express';
import multer from 'multer';

import userChatRouter from './routes/userChat.js';

const app = express();
// Default port is 3000, but it can be changed by setting PORT env variable
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(multer().any())
app.use(userChatRouter);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
