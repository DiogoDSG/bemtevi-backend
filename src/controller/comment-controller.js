import Comment from '../model/comment.js';
import Post from '../model/post.js';

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
    const { user } = req
    const { postId, commentId } = req.body
    try {
        const post = Post.findById(postId)
        
        const comments = post.comments
        res.status(200).send(comment);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllPostComments = async function (req, res) {
  try {
    const { post } = req
    const comments = await Comment.find({ post: post._id })
    //   .limit(req.query.limit || 20)
    //   .sort({ createdAt: -1 })
    //   .skip(req.query.skip || 0)
      .populate('owner', 'post');
    if (!comments) res.status(404).json({ error: "The post requested has no comments!" });

    res.send(comments);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const getPostsByUserId = async function (req, res) {
  try {
    const posts = await Post.find({ owner: req.params.id }).populate('owner');
    if (!posts) return res.status(404).send();

    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export default {
  createComment,
  getAllPostComments
};
