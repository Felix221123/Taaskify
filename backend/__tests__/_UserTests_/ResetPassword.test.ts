import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ResetPasswordController from '../../src/Controller/User/ResetPasswordController';
import UserBoardModel from '../../src/Models/UserModel';
import signJWT from '../../src/Functions/signJWT';

jest.mock('../../src/Functions/signJWT');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  // Set up the reset password route
  app.post('/reset-password', ResetPasswordController);
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
  jest.clearAllMocks();
});




test('Should reset password successfully', async () => {
  const hashedPassword = 'oldHashedPassword123';

  // Create a user in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: hashedPassword,
    boards: [],
  });

  // Mock JWT verification
  (jwt.verify as jest.Mock).mockReturnValue({ _id: user._id, emailAddress: user.emailAddress });

  // Mock bcrypt password comparison to return false (new password is different)
  (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(false);

  // Mock bcrypt password hashing
  (bcryptjs.hash as jest.Mock).mockResolvedValueOnce('newHashedPassword123');

  // Mock JWT signing function
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(null, 'new-mocked-jwt-token');
  });

  const response = await request(app).post('/reset-password').send({
    token: 'valid-reset-token',
    newPassword: 'newPassword123',
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Password reset successful');

  // Verify that the password was updated in the database
  const updatedUser = await UserBoardModel.findById(user._id);
  expect(updatedUser?.password).toBe('newHashedPassword123');

  // Check that the new JWT was issued and stored in a cookie
  expect(signJWT).toHaveBeenCalledTimes(1);
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=new-mocked-jwt-token/);
});


test('Should return 400 when token or new password is missing', async () => {
  // Missing token
  let response = await request(app).post('/reset-password').send({
    newPassword: 'newPassword123',
  });
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Token and new password are required');

  // Missing new password
  response = await request(app).post('/reset-password').send({
    token: 'valid-reset-token',
  });
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Token and new password are required');
});


test('Should return 500 when token is invalid', async () => {
  // Mock JWT verification to throw an error (invalid token)
  (jwt.verify as jest.Mock).mockImplementation(() => {
    throw new Error('Invalid token');
  });

  const response = await request(app).post('/reset-password').send({
    token: 'invalid-reset-token',
    newPassword: 'newPassword123',
  });

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('message', 'Error resetting password');
});
