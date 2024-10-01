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




test('Should delete the specified task from the column', async () => {
  // Step 1: Create a mock user with a board, column, and task in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedPassword',
    boards: [
      {
        name: 'Project Alpha',
        columns: [
          {
            name: 'To Do',
            tasks: [
              { title: 'Task 1', description: 'Description 1', status: 'To Do', subtasks: [] },
              { title: 'Task 2', description: 'Description 2', status: 'To Do', subtasks: [] },
            ],
          },
        ],
      },
    ],
  }) as any;

  // Step 2: Find the created board, column, and task
  const boardID = user.boards[0]._id.toString();
  const columnID = user.boards[0].columns[0]._id.toString();
  const taskID = user.boards[0].columns[0].tasks[0]._id.toString(); // We'll delete the first task

  // Step 3: Send the request to delete the task
  const response = await request(app)
    .delete('/api/user/board/deletetask')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),
      boardID: boardID,
      columnID: columnID,
      taskID: taskID,
    });

  // Step 4: Assert the response
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Task deleted successfully');
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);

  const updatedBoard = response.body.user.boards[0];
  const updatedColumn = updatedBoard.columns.find((col: any) => col.name === 'To Do');
  expect(updatedColumn.tasks).toHaveLength(1); // Task 1 should be deleted, leaving only Task 2

  // Step 5: Verify that the task was deleted from the database
  const updatedUser = await UserBoardModel.findById(user._id) as any;
  const updatedColumnInDB = updatedUser?.boards[0].columns.id(columnID);
  expect(updatedColumnInDB?.tasks).toHaveLength(1);
  expect(updatedColumnInDB?.tasks[0].title).toBe('Task 2'); // Ensure Task 1 was deleted
});



test('Should return 404 if the user is not found', async () => {
  // Step 1: Send a delete request with an invalid user ID
  const response = await request(app)
    .delete('/api/user/board/deletetask')
    .send({
      userID: 'nonexistentUserId',
      boardID: 'validBoardID',
      columnID: 'validColumnID',
      taskID: 'validTaskID',
    });

  // Step 2: Assert the response
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', 'User not found');
});




test('Should return 404 if the board is not found', async () => {
  // Step 1: Create a mock user without a board
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [],
  }) as Document;

  // Step 2: Send a delete request with a valid user ID but nonexistent board ID
  const response = await request(app)
    .delete('/api/user/board/deletetask')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),
      boardID: 'nonexistentBoardID',
      columnID: 'validColumnID',
      taskID: 'validTaskID',
    });

  // Step 3: Assert the response
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', 'Board not found');
});
