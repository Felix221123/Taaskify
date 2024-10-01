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



test('Should create a new task in the specified column', async () => {
  // Step 1: Create a mock user with a board and column in the database
  const user = await UserBoardModel.create({
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com',
    password: 'hashedpassword',
    boards: [
      {
        name: 'Project Alpha',
        columns: [
          { name: 'To Do', tasks: [] },
          { name: 'In Progress', tasks: [] },
          { name: 'Done', tasks: [] },
        ],
      },
    ],
  }) as any;

  // Step 2: Find the created board and column
  const boardID = user.boards[0]._id.toString();
  const columnID = user.boards[0].columns[0]._id.toString();

  // Step 3: Send the request to create a task in the "To Do" column
  const response = await request(app)
    .post('/api/user/board/createtask')
    .send({
      userID: (user._id as mongoose.Types.ObjectId).toString(),  // Ensure we convert the _id to a string
      boardID: boardID,
      columnID: columnID,
      taskTitle: 'New Task',
      description: 'Description of the task',
      subtasks: [
        { title: 'Subtask 1' },
        { title: 'Subtask 2' },
      ],
    });

  // Step 4: Assert the response, ignoring the _id fields
  expect(response.status).toBe(201);
  expect(response.body.user).toHaveProperty('boards');
  expect(response.body.user.boards).toHaveLength(1);

  const updatedBoard = response.body.user.boards[0];
  expect(updatedBoard.columns).toHaveLength(3);

  // Omit the _id fields when comparing columns and tasks
  const toDoColumn = updatedBoard.columns.find((col: any) => col.name === 'To Do');
  const receivedTasks = toDoColumn.tasks.map((task: any) => ({
    title: task.title,
    description: task.description,
    subtasks: task.subtasks.map((subtask: any) => ({
      title: subtask.title,
      isCompleted: subtask.isCompleted
    }))
  }));

  expect(receivedTasks).toEqual([
    {
      title: 'New Task',
      description: 'Description of the task',
      subtasks: [
        { title: 'Subtask 1', isCompleted: false },
        { title: 'Subtask 2', isCompleted: false },
      ]
    }
  ]);

  // Step 5: Verify that the task was added to the database
  const updatedUser = await UserBoardModel.findById(user._id) as any;
  const updatedColumn = updatedUser?.boards[0].columns.id(columnID);
  expect(updatedColumn?.tasks).toHaveLength(1);

  const createdTask = updatedColumn?.tasks[0];
  expect(createdTask.title).toBe('New Task');
  expect(createdTask.description).toBe('Description of the task');
  expect(createdTask.subtasks).toHaveLength(2);
});
