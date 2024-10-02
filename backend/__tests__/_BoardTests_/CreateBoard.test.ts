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

test('Should create a new board for the user', async () => {
  // Step 1: Create a mock user in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedPassword',
    boards: [],
  }) as Document;

  // Step 2: Send the request to create a board
  const response = await request(app)
    .post('/api/user/board/createboard')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),  // Ensure we convert the _id to a string
      name: 'New Project',
      columns: [
        { name: 'To Do', tasks: [] },
        { name: 'In Progress', tasks: [] },
        { name: 'Done', tasks: [] }
      ],
    });

  // Step 3: Assert the response
  expect(response.status).toBe(201);
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);
  expect(response.body.user.boards[0]).toHaveProperty('name', 'New Project');
  expect(response.body.user.boards[0]).toHaveProperty('columns');
  // Step 4: Validate the columns without checking the generated _id field
  const receivedColumns = response.body.user.boards[0].columns.map((column: any) => ({
    name: column.name,
    tasks: column.tasks
  }));

  expect(receivedColumns).toEqual([
    { name: 'To Do', tasks: [] },
    { name: 'In Progress', tasks: [] },
    { name: 'Done', tasks: [] }
  ]);

  // Step 4: Verify that the board was added to the database
  const updatedUser = await UserBoardModel.findById(user._id) as any;
  expect(updatedUser?.boards).toHaveLength(1);
  expect(updatedUser?.boards[0].name).toBe('New Project');

});


test('Should return 400 for invalid input (missing userID or name)', async () => {
  // Step 1: Send a request with missing parameters
  const response = await request(app)
    .post('/api/user/board/createboard')
    .send({
      name: 'New Project',
      columns: ['To Do', 'In Progress', 'Done'],
    });

  // Step 2: Assert the response
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'Invalid input');
});


test('Should return 404 if user is not found', async () => {
  // Step 1: Send a request with an invalid userID
  const response = await request(app)
    .post('/api/user/board/createboard')
    .send({
      // Use an invalid userID to test the 404 case
      userID: new mongoose.Types.ObjectId().toString(),
      name: 'New Project',
      columns: ['To Do', 'In Progress', 'Done'],
    });

  // Step 2: Assert the response
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', 'User not found');
});
