import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../src/model/user.js';
import Post from '../../src/model/post.js';
import Comment from '../../src/model/comment.js';

const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
  _id: userOneId,
  fullName: 'Mike',
  username: 'mikebala',
  email: 'mike@example.com',
  password: '56what!!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

export const setupDataBase = async () => {
  await User.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();
  await new User(userOne).save();
};
