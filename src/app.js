import express from 'express';
import './db/mongoose.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
import jwt from 'express-jwt';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(cookieParser());
// app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(userRouter);
app.use(postRouter);

app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    getToken: req => req.cookies.token || null,
    algorithms: ['HS256'],
  })
);

export default app;
