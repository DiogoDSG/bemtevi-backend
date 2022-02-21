import express from 'express';
import Post from '../model/post.js';
import { auth } from '../middleware/auth.js';

const router = new express.Router();

router.post('/posts', auth, async function (req, res) {
  const post = new Post({
    ...req.body,
    numberLikes: 0,
    numberComments: 0,
    owner: req.user._id,
  });
  try {
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/posts', auth, async function (req, res) {
  try {
    const posts = await Post.find({})
      .limit(req.query.limit || 20)
      .sort({ createdAt: -1 })
      .skip(req.query.skip || 0);
    if (!posts) res.status(404).send();

    res.send(posts);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/posts/:id', auth, async function (req, res) {
  try {
    const posts = await Post.find({ owner: req.params.id });
    if (!posts) return res.status(404).send();

    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/posts/like/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('404');
    if (!post.likes.includes(req.user._id)) post.likes.push(req.user._id);
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/posts/dislike/:id', auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('404');
    post.likes = post.likes.filter(id => !id.equals(req.user._id));
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default router;
