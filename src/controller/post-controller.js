import Post from '../model/post.js';
import Comment from '../model/comment.js';
import { CustomError } from '../errors/custom-error.js';


const createPost = async function (req, res) {
  try {
    const post = new Post({
      ...req.body,
      numberLikes: 0,
      numberComments: 0,
      owner: req.user._id,
    });
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllPosts = async function (req, res) {
  try {
    const posts = await Post.find({})
      .limit(req.query.limit || 20)
      .sort({ createdAt: -1 })
      .skip(req.query.skip || 0)
      .populate('owner')
    if (!posts) throw new CustomError("Posts not found!", 404);

    res.send(posts);
  } catch (error) {
    res.status(error.statusCode).send({ error: error.message });
  }
};

const getPostsByUserId = async function (req, res) {
  try {
    const posts = await Post.find({ owner: req.params.id }).populate('owner');
    if (!posts) throw new CustomError("Posts not found!", 404);

    res.send(posts);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
};

const likePost = async function (req, res) {
  try {
    const { post } = req;
    if (post.likes.includes(req.user._id)) throw new CustomError("Already liked this post!", 403)
    post.likes.push(req.user._id);
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(error.stautsCode).json({error: error.message});
  }
};

const dislikePost = async function (req, res) {
  try {
    const { post } = req;
    post.likes = post.likes.filter(id => !id.equals(req.user._id));
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send();
  }
};

const removePost = async function (req, res) {
  try {
    const { post } = req
    post.comments.map(async comment => await Comment.findByIdAndDelete(comment._id))
    await Post.findByIdAndDelete(post._id)
    return res.status(204).send()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export default {
  createPost,
  getAllPosts,
  getPostsByUserId,
  likePost,
  dislikePost,
  removePost
};
