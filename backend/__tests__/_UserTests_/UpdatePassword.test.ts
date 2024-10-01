import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcryptjs from 'bcryptjs';
import UpdatePasswordForLoggedInUsersController from '../../src/Controller/User/UpdatePasswordForLoggedInUsersController';
import UserBoardModel from '../../src/Models/UserModel';
import signJWT from '../../src/Functions/signJWT';
import cookieParser from 'cookie-parser';
import extractJWT from '../../src/Middleware/extractJWT'; // Mock this

jest.mock('../../src/Middleware/extractJWT'); // Mock extractJWT
jest.mock('../../src/Functions/signJWT'); // Mock signJWT

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Set up the route with the mocked extractJWT
  app.post('/update-password', extractJWT, UpdatePasswordForLoggedInUsersController);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
  jest.clearAllMocks();
});

test('Should update password for authenticated user successfully', async () => {
  const hashedPassword = await bcryptjs.hash('oldPassword123', 12);

  // Create a mock authenticated user in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: hashedPassword,
    boards: [],
    currentSessionToken: 'mocked-jwt-token',
  });

  // Mock `extractJWT` to attach the user to the request
  (extractJWT as jest.Mock).mockImplementation((req, _res, next) => {
    req.user = user;
    next();
  });

  // Mock `signJWT` to return a token
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(null, 'new-mocked-jwt-token');
  });

  const response = await request(app).post('/update-password').send({
    currentPassword: 'oldPassword123',
    newPassword: 'newPassword123',
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Password updated successfully');
  expect(response.body.user).toHaveProperty('emailAddress', 'john@example.com');
  expect(response.body.user).not.toHaveProperty('password');

  // Check that the new JWT was issued
  expect(signJWT).toHaveBeenCalledTimes(1);
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=new-mocked-jwt-token/);

  // Verify that the password was updated in the database
  const updatedUser = await UserBoardModel.findById(user._id);
  const isPasswordMatch = await bcryptjs.compare('newPassword123', updatedUser?.password || '');
  expect(isPasswordMatch).toBe(true);
});


test('Should return 401 when current password is incorrect', async () => {
  const hashedPassword = await bcryptjs.hash('oldPassword123', 12);

  // Create a mock authenticated user in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: hashedPassword,
    boards: [],
    currentSessionToken: 'mocked-jwt-token',
  });

  // Mock `extractJWT` to attach the user to the request
  (extractJWT as jest.Mock).mockImplementation((req, _res, next) => {
    req.user = user;
    next();
  });

  const response = await request(app).post('/update-password').send({
    currentPassword: 'wrongPassword',
    newPassword: 'newPassword123',
  });

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message', 'Current password is incorrect');
});


test('Should return 400 when required parameters are missing', async () => {
  // Create a mock authenticated user
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
    currentSessionToken: 'mocked-jwt-token',
  });

  // Mock `extractJWT` to attach the user to the request
  (extractJWT as jest.Mock).mockImplementation((req, _res, next) => {
    req.user = user;
    next();
  });

  const response = await request(app).post('/update-password').send({
    currentPassword: '',
    newPassword: '',
  });

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Parameters missing');
});
