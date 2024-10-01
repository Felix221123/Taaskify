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

test('Should update the status of a subtask and ensure task status is retained', async () => {
  // Step 1: Create a mock user with a board, column, task, and subtasks in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [
      {
        name: 'Project Alpha',
        columns: [
          {
            name: 'To Do',
            tasks: [
              {
                title: 'Main Task',
                description: 'Main task description',
                status: 'To Do', // Ensure status is set
                subtasks: [
                  { title: 'Subtask 1', isCompleted: false },
                  { title: 'Subtask 2', isCompleted: true },
                ],
              },
            ],
          },
        ],
      },
    ],
  }) as any;

  // Step 2: Find the created board, column, task, and subtask
  const boardID = user.boards[0]._id.toString();
  const columnID = user.boards[0].columns[0]._id.toString();
  const taskID = user.boards[0].columns[0].tasks[0]._id.toString();
  const subtaskID = user.boards[0].columns[0].tasks[0].subtasks[0]._id.toString();

  // Step 3: Send the request to update the subtask's completion status
  const response = await request(app)
    .put('/api/user/board/update-subtask-status')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),
      boardID: boardID,
      columnID: columnID,
      taskID: taskID,
      subtaskID: subtaskID,
      isCompleted: true,
    });

  // Step 4: Assert the response
  expect(response.status).toBe(200);
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);

  const updatedBoard = response.body.user.boards[0];
  expect(updatedBoard.columns).toHaveLength(1);

  // Omit the _id fields when comparing columns, tasks, and subtasks
  const toDoColumn = updatedBoard.columns.find((col: any) => col.name === 'To Do');
  const receivedTasks = toDoColumn.tasks.map((task: any) => ({
    title: task.title,
    status: task.status,  // Include status in the assertion
    subtasks: task.subtasks.map((subtask: any) => ({
      title: subtask.title,
      isCompleted: subtask.isCompleted,
    }))
  }));

  expect(receivedTasks).toEqual([
    {
      title: 'Main Task',
      status: 'To Do',  // Check that status is retained
      subtasks: [
        { title: 'Subtask 1', isCompleted: true },  // Status should be updated to true
        { title: 'Subtask 2', isCompleted: true },
      ]
    }
  ]);


  // Step 5: Verify that the subtask status was updated in the database
  const updatedUser = await UserBoardModel.findById(user._id).lean() as any;  // Use lean() to simplify the document structure
  const updatedColumn = updatedUser?.boards[0].columns.find((column: any) => column._id.toString() === columnID.toString());
  const updatedTask = updatedColumn?.tasks.find((task: any) => task._id.toString() === taskID.toString());
  const updatedSubtask = updatedTask?.subtasks.find((subtask: any) => subtask._id.toString() === subtaskID.toString());

  expect(updatedSubtask.isCompleted).toBe(true);  // Assert that the subtask's status is updated
  expect(updatedTask.status).toBe('To Do'); 
});
