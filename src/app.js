import express from 'express';
import cors from 'cors';

import './db/mongoose.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

export default app;
