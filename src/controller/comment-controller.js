import Comment from '../model/comment.js';
import { CustomError } from "../errors/custom-error.js"

const createComment = async function (req, res) {
    const { user, post } = req
    const { message } = req.body
    try {
        const comment = new Comment({
            message: message,
            owner: user._id,
            post: post._id
        });
        post.comments.push(comment)
        await post.save();
        await comment.save()
        res.status(200).send(comment);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const removeComment = async function (req, res) {
    const { user, post } = req
    const { commentId } = req.body
    try {
        const comment = await Comment.findById(commentId)
        if (!comment) {
          throw new CustomError("Comment not found!", 404)
        }
        if (!comment.post._id.equals(post._id)) {
          throw new CustomError("Comment and post do not match!", 400)
        }
        if (!comment.owner._id.equals(user._id)) {
          throw new CustomError("Not allowed!", 403)
        }
        await Comment.findByIdAndDelete(commentId)
        post.comments.filter(comment => comment._id !== commentId)
        await post.save()
        res.status(204).send();
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
};

const getAllPostComments = async function (req, res) {
  try {
    const { post } = req
    const comments = await Comment.find({ post: post._id })
      .limit(req.query.limit || 20)
      .sort({ createdAt: -1 })
      .skip(req.query.skip || 0)
      .populate('owner')
    if (!comments) throw new CustomError("The post requested has no comments!", 404)

    res.send(comments);
  } catch (error) {
    res.status(error.statusCode).send({ error: error.message });
  }
};

export default {
  createComment,
  getAllPostComments,
  removeComment
};
