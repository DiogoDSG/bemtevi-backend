import express from 'express';
import cors from 'cors';

import './db/mongoose.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import commentRouter from "./routes/comment.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter)

export default app;
