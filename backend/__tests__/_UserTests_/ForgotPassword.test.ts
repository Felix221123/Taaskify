import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ForgotPasswordController from '../../src/Controller/User/ForgotPasswordController';
import UserBoardModel from '../../src/Models/UserModel';
import signJWT from '../../src/Functions/signJWT';
import { sendEmail } from '../../src/Services/EmailService';



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

  // Set up the forgot password route
  app.post('/forgot-password', ForgotPasswordController);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
  jest.clearAllMocks();
});


test('Should send password reset email successfully', async () => {
  // Create a user in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
  });
  console.log(`here is the user created ${user}`);


  // Mock the JWT signing function to return a reset token
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(null, 'mocked-reset-token');
  });

  // Mock the email sending function
  (sendEmail as jest.Mock).mockResolvedValue(true);

  const response = await request(app).post('/forgot-password').send({
    emailAddress: 'john@example.com',
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Password reset email sent');
  expect(response.body).toHaveProperty('resetToken', 'mocked-reset-token');

  // Verify that the JWT was generated and the email was sent
  expect(signJWT).toHaveBeenCalledTimes(1);
  expect(sendEmail).toHaveBeenCalledTimes(1);
  expect(sendEmail).toHaveBeenCalledWith(
    ['john@example.com'],
    'Password Reset Request',
    expect.any(String) // Ensure some email template is passed
  );
});


test('Should return 400 when email address is missing', async () => {
  const response = await request(app).post('/forgot-password').send({});

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Email address is required');
});


test('Should return 404 when user does not exist', async () => {
  const response = await request(app).post('/forgot-password').send({
    emailAddress: 'nonexistent@example.com',
  });

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', 'User with that email does not exist');
});


test('Should return 500 when JWT token generation fails', async () => {
  // Create a user in the database
  await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
  });

  // Mock the JWT signing function to simulate an error
  (signJWT as jest.Mock).mockImplementation((_user, callback) => {
    callback(new Error('JWT generation failed'), null);
  });

  const response = await request(app).post('/forgot-password').send({
    emailAddress: 'john@example.com',
  });

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('message', 'Unable to sign reset token');
});
