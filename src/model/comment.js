import mongoose from 'mongoose';

const commentModel = new mongoose.Schema(
  {
    message: { type: String, minlength: 1, maxlength: 256, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(commentModel, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
