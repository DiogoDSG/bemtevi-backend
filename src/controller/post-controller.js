import Post from '../model/post.js';
import { io } from '../socket.js';

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
    io.emit('createPost', await post.populate('owner'));
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
      .populate('owner');
    if (!posts) res.status(404).send();

    res.send(posts);
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

const likePost = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('404');
    if (!post.likes.includes(req.user._id)) post.likes.push(req.user._id);
    await post.save();
    res.send(post);
    io.emit('updatePostLike', post);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const dislikePost = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('404');
    post.likes = post.likes.filter(id => !id.equals(req.user._id));
    await post.save();
    res.send(post);
    io.emit('updatePostLike', post);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export default {
  createPost,
  getAllPosts,
  getPostsByUserId,
  likePost,
  dislikePost,
};
