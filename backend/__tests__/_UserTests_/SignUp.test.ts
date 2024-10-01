import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import SignUpUserController from '../../src/Controller/User/SignUpUserController';
import UserBoardModel from '../../src/Models/UserModel';
import signJWT from '../../src/Functions/signJWT';
import { sendEmail } from '../../src/Services/EmailService';
import cookieParser from 'cookie-parser';


jest.mock('../../src/Functions/signJWT');
jest.mock('../../src/Services/EmailService');

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post('/signup', SignUpUserController);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({}); // Clean up the database after each test
  jest.clearAllMocks(); // Clear all mocks after each test
});



test('Should sign up and log in user successfully', async () => {
  jest.setTimeout(10000);
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(null, 'mocked-jwt-token');
  });
  (sendEmail as jest.Mock).mockResolvedValueOnce(true); // Mock email sending

  const response = await request(app)
    .post('/signup')
    .set('Cookie', 'authToken=mocked-jwt-token') // Manually set the authToken cookie
    .send({
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
      password: 'password123',
    });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('message', 'User registered and logged in successfully');
  expect(response.body.user).toHaveProperty('emailAddress', 'john@example.com');
  expect(response.body.user).not.toHaveProperty('password'); // Ensure password is not returned

  // Verify that the JWT was signed and sent in a cookie
  expect(signJWT).toHaveBeenCalledTimes(1);
  expect(response.headers['set-cookie'][0]).toMatch(/authToken=mocked-jwt-token/);

  // Verify that the welcome email was sent
  expect(sendEmail).toHaveBeenCalledWith(
    ['john@example.com'],
    'Welcome to Taaskify',
    expect.any(String) // Ensure some email template is passed
  );
});




test('Should return 409 when email already exists', async () => {
  await UserBoardModel.create({
    firstName: 'Existing',
    lastName: 'User',
    emailAddress: 'existing@example.com',
    password: 'hashedpassword',
  });

  const response = await request(app).post('/signup').send({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'existing@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(409);
  expect(response.body).toHaveProperty('error', 'A user with this email already exists');
});
