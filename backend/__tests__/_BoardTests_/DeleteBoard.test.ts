import request from 'supertest';
import mongoose, { Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/server';
import UserBoardModel from '../../src/Models/UserModel';
import cookieParser from 'cookie-parser';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app.use(cookieParser());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await UserBoardModel.deleteMany({});
});




test('Should delete the specified board from the user', async () => {
  // Step 1: Create a mock user with a board
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [
      { name: 'Project Alpha', columns: [] },
      { name: 'Project Beta', columns: [] },
    ],
  }) as any;

  // Step 2: Find the created board
  const boardID = user.boards[0]._id.toString(); // Delete the first board

  // Step 3: Send the request to delete the board
  const response = await request(app)
    .delete('/api/user/board/deleteboard')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),  // Ensure we convert the _id to a string
      boardID: boardID,
    });

  // Step 4: Assert the response
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Board deleted successfully');
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);
  expect(response.body.user.boards[0].name).toBe('Project Beta');

  // Step 5: Verify that the board was deleted from the database
  const updatedUser = await UserBoardModel.findById(user._id) as any;
  expect(updatedUser?.boards).toHaveLength(1);
  expect(updatedUser?.boards[0].name).toBe('Project Beta');
});


test('Should return 404 if the board is not found', async () => {
  // Step 1: Create a mock user without any boards
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
  }) as Document;

  // Step 2: Send a delete request with a valid user ID but nonexistent board ID
  const response = await request(app)
    .delete('/api/user/board/deleteboard')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),  // Ensure we convert the _id to a string
      boardID: 'nonexistentBoardID',
    });

  // Step 3: Assert the response
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', 'Board not found');
});



test('Should return 400 if input is invalid', async () => {
  // Step 1: Create a mock user
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
  }) as Document;
  console.log(user);


  // Step 2: Send a delete request with missing userID and boardID
  const response = await request(app)
    .delete('/api/user/board/deleteboard')
    .send({
      userID: null,
      boardID: null,
    });

  // Step 3: Assert the response
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Invalid input');
});
