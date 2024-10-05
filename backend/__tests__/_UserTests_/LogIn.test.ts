import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import LogInUserController from '../../src/Controller/User/LogInUserController';
import UserBoardModel from '../../src/Models/UserModel';
import signJWT from '../../src/Functions/signJWT';
import bcryptjs from 'bcryptjs';
import cookieParser from 'cookie-parser';

jest.mock('../../src/Functions/signJWT');

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post('/login', LogInUserController);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
  jest.clearAllMocks();
});



test('Should log in user successfully', async () => {
  const hashedPassword = await bcryptjs.hash('password123', 12);

  // Create a test user in the database
  await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: hashedPassword,
    boards: [],
    currentSessionToken: null,
  });

  // Mock signJWT to return a token
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(null, 'mocked-jwt-token');
  });

  const response = await request(app).post('/login').send({
    emailAddress: 'john@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Auth Successful');
  expect(response.body.user).toHaveProperty('emailAddress', 'john@example.com');
  expect(response.body.user).not.toHaveProperty('password');

  // Check if JWT was signed and sent in the cookie
  expect(signJWT).toHaveBeenCalledTimes(1);
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=mocked-jwt-token/);

  // Verify that the user's session token was saved in the database
  const user = await UserBoardModel.findOne({ emailAddress: 'john@example.com' });
  expect(user?.currentSessionToken).toBe('mocked-jwt-token');
});


// test('Should return 401 for invalid email', async () => {
//   const response = await request(app).post('/login').send({
//     emailAddress: 'nonexistent@example.com',
//     password: 'password123',
//   });

//   expect(response.status).toBe(401);
//   expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
// });


// test('Should return 401 for invalid password', async () => {
//   const hashedPassword = await bcryptjs.hash('password123', 12);

//   // Create a test user with a valid email but incorrect password
//   await UserBoardModel.create({
//     firstName: 'John',
//     lastName: 'Doe',
//     emailAddress: 'john@example.com',
//     password: hashedPassword,
//     boards: [],
//     currentSessionToken: null,
//   });

//   const response = await request(app).post('/login').send({
//     emailAddress: 'john@example.com',
//     password: 'wrongpassword',
//   });

//   expect(response.status).toBe(401);
//   expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
// });


// test('Should return 500 when required parameters are missing', async () => {
//   const response = await request(app).post('/login').send({
//     emailAddress: '',
//     password:''
//   });

//   expect(response.status).toBe(400);
//   expect(response.body).toHaveProperty('message', 'Parameters missing');
// });
