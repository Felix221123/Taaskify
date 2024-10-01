import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import LogOutUserController from '../../src/Controller/User/LogOutUserController';
import UserBoardModel from '../../src/Models/UserModel';
import cookieParser from 'cookie-parser';
import extractJWT from '../../src/Middleware/extractJWT';


jest.mock('../../src/Middleware/extractJWT'); // Mock extractJWT

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Set up the logout route with the mocked extractJWT middleware
  app.post('/logout', extractJWT, LogOutUserController);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
  jest.clearAllMocks();
});


test('Should log out user successfully', async () => {
  // Create a mock authenticated user in the database
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

  const response = await request(app).post('/logout').send();

  // Check the response status and message
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'User logged out successfully');

  // Check that the session token was cleared
  const updatedUser = await UserBoardModel.findById(user._id);
  expect(updatedUser?.currentSessionToken).toBeNull();

  // Check that the JWT cookie was cleared
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=;/); // JWT cookie should be cleared
});


test('Should handle logout when no user is authenticated', async () => {
  // Mock `extractJWT` to simulate no authenticated user
  (extractJWT as jest.Mock).mockImplementation((req, _res, next) => {
    req.user = null; // No authenticated user
    next();
  });

  const response = await request(app).post('/logout').send();

  // Check the response status and message
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'User logged out successfully');

  // Check that the JWT cookie was cleared
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=;/); // JWT cookie should be cleared
});
