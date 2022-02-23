import mongoose from 'mongoose';

const schema = new mongoose.Schema(
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

export default mongoose.model('Comment', schema);
