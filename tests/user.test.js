import request from 'supertest';
import app from '../src/app';
import User from '../src/model/user.js';
import { ObjectId } from 'mongoose';

import { userOne, setupDataBase } from './fixture/db.js';

beforeEach(setupDataBase);

test('Should create a user', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'laura@example.com',
      password: '123456',
      username: 'laura_muller',
      fullName: 'laura muller',
    })
    .expect(201);

  const user = await User.findById(response._body.user._id);
  expect(user).not.toBeNull();

  expect(response._body).toMatchObject({
    user: {
      email: 'laura@example.com',
      username: 'laura_muller',
      fullName: 'laura muller',
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('123456');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response._body.user._id);
  expect(user).not.toBeNull();

  console.log(response._body);
  expect(response._body).toMatchObject({
    user: {
      email: userOne.email,
      username: userOne.username,
      fullName: userOne.fullName,
    },
    token: user.tokens[1].token,
  });
});
