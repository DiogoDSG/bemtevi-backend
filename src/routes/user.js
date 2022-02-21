import express from 'express';
import User from '../model/user.js';
import { auth } from '../middleware/auth.js';

const router = new express.Router();

router.post('/users', async function (req, res) {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie('token', token, { httpOnly: true });
    res.status(201).send({ user, token });
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error.message.includes('username_1 dup key')) {
      errorMessage = 'Username already taken.';
    } else if (error.message.includes('email_1 dup key')) {
      errorMessage = 'Email already taken.';
    }

    res.status(400).send({ error: errorMessage });
  }
});

router.post('/users/login', async function (req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie('token', token, { httpOnly: true });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Invalid account.' });
  }
});

router.get('/users/me', auth, async function (req, res) {
  res.send({ user: req.user, token: req.token });
});

router.get('/users/public/:id', async function (req, res) {
  const id = req.params.id;
  if (!id) res.status(404).send();
  try {
    const user = await User.findById(id);
    const names = user.fullName.split(' ');
    const publicUser = {
      username: user.username,
      fullName: `${names[0]} ${names[names.length - 1]}`,
    };
    res.send(publicUser);
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

export default router;
