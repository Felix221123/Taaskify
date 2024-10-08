import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { Types } from "mongoose";



const UpdateSubtaskStatusController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { userID, boardID, columnID, taskID, subtaskID, isCompleted } = req.body;

  try {
    // Validate the input
    if (!userID || !boardID || !columnID || !taskID || !subtaskID) {
      await res.status(400).json({ message: 'Invalid input: Missing required fields' });
    }

    // Find the user by ID
    const user = await UserBoardModel.findById(userID);

    if (!user) {
      await res.status(404).json({ message: 'User not found' });
    } else {
      // Find the board by its ID
    const board = user.boards.id(boardID) as any;

    if (!board) {
      await res.status(404).json({ message: 'Board not found' });
    }

    // Find the column by its ID within the found board
    const column = board.columns.id(columnID) as any;

    if (!column) {
      await res.status(404).json({ message: 'Column not found' });
    }

    // Find the task by its ID within the found column
    const task = column.tasks.id(taskID) as any;

    if (!task) {
      await res.status(404).json({ message: 'Task not found' });
    }

    // Find the subtask by its ID within the found task
    const subtask = task.subtasks.id(subtaskID) as any;

    if (!subtask) {
      await res.status(404).json({ message: 'Subtask not found' });
    }

    // Update the subtask's completion status
    subtask.isCompleted = isCompleted;

    // Ensure that the task's status is retained or updated
    task.status = task.status || column._id;

    // Save the updated user document
    await user.save();

    // Emit the "subtask-updated" event via Socket.IO
    const io = getSocketIO();
    if (io) {
      io.emit("subtask-updated", {
        userID: (user._id as Types.ObjectId).toString(),
        boardID: boardID,
        columnID: columnID,
        taskID: taskID,
        subtask: {
          _id: subtask._id.toString(),
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        },
      });
    } else {
      console.error("Socket.IO is not initialized.");
    }

    // Remove the password from the user object before awaiting it
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

    // await the updated user document
    await res.status(200).json({
      message: 'Subtask status updated successfully',
      user: userWithoutPassword,
    });
    }



  } catch (error) {
    await res.status(500).json({ message: 'Server error', error });
  }
};

export default UpdateSubtaskStatusController;
