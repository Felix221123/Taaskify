import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { Types } from "mongoose";


const EditTaskController: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
  const { userID, boardID, columnID, taskID, taskTitle, description, status, subtasks } = req.body;

  try {
    // Validate the input
    if (!userID || !boardID || !columnID || !taskID || !taskTitle) {
      return res.status(400).json({ message: 'Invalid input: Missing required fields' });
    }

    // Find the user by ID
    const user = await UserBoardModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the board by its ID
    const board = user.boards.id(boardID) as any;

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Find the column by its ID within the found board
    const currentColumn = board.columns.find((col: any) => col.tasks.id(taskID));

    if (!currentColumn) {
      return res.status(404).json({ message: 'Current column not found' });
    }

    // Find the task by its ID within the current column
    const task = currentColumn.tasks.id(taskID);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let taskMoved = false;
    let newColumn: any = null;

    // Check if the task needs to be moved to a new column
    if (currentColumn._id.toString() !== columnID) {
      taskMoved = true;
      // Find the new column by its ID
      newColumn = board.columns.find((col: any) => col._id.toString() === columnID);

      if (!newColumn) {
        return res.status(404).json({ message: 'New column not found' });
      }

      // Remove the task from the current column
      currentColumn.tasks.pull(taskID);

      // Add the task to the new column
      newColumn.tasks.push({
        _id: task._id,
        title: taskTitle,
        description: description || task.description,
        status: status || task.status,
        subtasks: subtasks && subtasks.length > 0 ? subtasks.map((subtask: { title: string, isCompleted: boolean, _id?:string }) => ({
          _id: subtask._id || new Types.ObjectId() ,
          title: subtask.title,
          isCompleted: subtask.isCompleted || false,
        })) : task.subtasks
      });
      console.log(subtasks, 'here is the subtask')
    } else {
      // Update the task's details in the current column
      task.title = taskTitle;
      task.description = description || task.description;
      task.status = status || task.status;

      // Update subtasks if provided
      if (subtasks && subtasks.length > 0) {
        task.subtasks = subtasks.map((subtask: { title: string, isCompleted: boolean,_id?:string }) => ({
          _id: subtask._id || new Types.ObjectId() ,
          title: subtask.title,
          isCompleted: subtask.isCompleted || false,
        }));
        console.log(subtasks, 'here is the subtask');
      }
    }

    // Save the updated user document
    await user.save();

    // Fetch the updated user with full board data (including tasks and id)
    const updatedUser = await UserBoardModel.findById(userID).lean();

    // Validate that the updated user is found
    if (!updatedUser || !updatedUser.boards) {
      return res.status(500).json({ message: 'Failed to retrieve updated user data' });
    }

    // Emit the updated task details to all connected clients via Socket.IO
    const io = getSocketIO();
    if (io) {
      io.emit('update-task', {
        userID: (user._id as Types.ObjectId).toString(),
        boardID: boardID,
        columnID: taskMoved ? newColumn._id.toString() : currentColumn._id.toString(),
        task: {
          _id: task._id.toString(),
          title: taskTitle,
          description: description || task.description,
          status: status || task.status,
          subtasks: subtasks && subtasks.length > 0 ? subtasks.map((subtask: { title: string, isCompleted: boolean, _id?:string }) => ({
            _id: subtask._id || new Types.ObjectId() , // Retain subtask ID or generate new if missing
            title: subtask.title,
            isCompleted: subtask.isCompleted || false,
          })) : task.subtasks
        }
      });
    } else {
      console.error('Socket.IO is not initialized.');
    }

    // Remove the password from the user object before returning it
    const userWithoutPassword = {
      _id: user._id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      boards: user.boards,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
    };

    // Return the updated user document
    return res.status(200).json({
      message: 'Task updated successfully',
      user: userWithoutPassword,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export default EditTaskController;
