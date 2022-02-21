import mongoose from 'mongoose';

const postModel = {
  author: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 512,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
};

const postSchema = new mongoose.Schema(postModel, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
