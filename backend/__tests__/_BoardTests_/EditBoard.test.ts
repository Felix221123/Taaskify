import request from 'supertest';
import mongoose from 'mongoose';
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





test('Should edit an existing board for the user', async () => {
  // Step 1: Create a mock user with a board
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [
      {
        name: 'Old Project Name',
        columns: [
          { name: 'To Do', tasks: [] },
          { name: 'In Progress', tasks: [] },
          { name: 'Done', tasks: [] },
        ],
      },
    ],
  }) as any;

  // Step 2: Find the created board ID
  const boardID = user.boards[0]._id.toString();

  // Step 3: Send the request to edit the board
  const response = await request(app)
    .patch('/api/user/board/editboard')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),  // Ensure we convert the _id to a string
      boardID: boardID,
      name: 'Updated Project Name',
      columns: [
        { name: 'Backlog', tasks: [] },
        { name: 'Review', tasks: [] },
        { name: 'Completed', tasks: [] }
      ],
    });

  // Step 4: Assert the response, ignoring the _id fields
  expect(response.status).toBe(200);
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);

  const updatedBoard = response.body.user.boards[0];
  expect(updatedBoard).toHaveProperty('name', 'Updated Project Name');
  expect(updatedBoard.columns).toHaveLength(3);

  // Omit the _id fields when comparing columns and tasks
  const receivedColumns = updatedBoard.columns.map((column: any) => ({
    name: column.name,
    tasks: column.tasks
  }));

  expect(receivedColumns).toEqual([
    { name: 'Backlog', tasks: [] },
    { name: 'Review', tasks: [] },
    { name: 'Completed', tasks: [] }
  ]);

  // Step 5: Verify that the board was updated in the database
  const updatedUser = await UserBoardModel.findById(user._id) as any;
  const updatedBoardInDB = updatedUser.boards.id(boardID);

  // Exclude _id fields when verifying the board and columns in the database
  const dbColumns = updatedBoardInDB.columns.map((column: any) => ({
    name: column.name,
    tasks: column.tasks
  }));

  expect(updatedBoardInDB.name).toBe('Updated Project Name');
  expect(dbColumns).toEqual([
    { name: 'Backlog', tasks: [] },
    { name: 'Review', tasks: [] },
    { name: 'Completed', tasks: [] }
  ]);
});
