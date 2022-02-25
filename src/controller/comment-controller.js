import Comment from '../model/comment.js';

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
    const { commentId } = req.params
    try {
        const comment = await Comment.findById(commentId)
        if (!comment) {
          return res.status(404).json({ error: "Comment not found" })
        }
        if (!comment.post._id.equals(post._id)) {
          return res.status(400).json({ error: "Comment and post do not match" })
        }
        if (!comment.owner._id.equals(user._id)) {
          return res.status(403).json({ error: "Not allowed" })
        }
        await Comment.findByIdAndDelete(commentId)
        post.comments.filter(comment => comment._id !== commentId)
        await post.save()
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ error: error.message });
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
      .populate('post')
    if (!comments) res.status(404).json({ error: "The post requested has no comments!" });

    res.send(comments);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export default {
  createComment,
  getAllPostComments,
  removeComment
};
