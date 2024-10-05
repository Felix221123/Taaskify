import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { Types } from "mongoose";
import { User } from '../../Interface/UserData';




const DeleteTaskController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { userID, boardID, columnID, taskID } = req.body;

  try {
    // Validate the input
    if (!userID || !boardID || !columnID || !taskID) {
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
      const column = board.columns.id(columnID);

      if (!column) {
        await res.status(404).json({ message: 'Column not found' });
      }

      // Find the task by its ID within the found column
      const taskIndex = column.tasks.findIndex((task: any) => task._id.toString() === taskID);

      if (taskIndex === -1) {
        await res.status(404).json({ message: 'Task not found' });
      }

      // Remove the task from the column's tasks array
      // const deletedTask = column.tasks[taskIndex];     // Store the deleted task
      column.tasks.splice(taskIndex, 1);

      // Save the updated user document
      await user.save();

      // Fetch the updated user with full board data (including tasks and id)
      const updatedUser = await UserBoardModel.findById(userID).lean();

      // Ensure updatedUser exists and contains the boards property
      if (updatedUser === null || typeof updatedUser !== 'object' || !('boards' in updatedUser)) {
        await res.status(500).json({ message: "Failed to retrieve updated user data" });
      }

      // Cast the updated user to the User type
      const safeUpdatedUser = updatedUser as unknown as User;

      // Check if the task is still present (it shouldn't be)
      const boardAfterDeletion = safeUpdatedUser.boards.find((b) => b._id.toString() === boardID);
      const columnAfterDeletion = boardAfterDeletion?.columns.find((c) => c._id.toString() === columnID);
      const taskStillExists = columnAfterDeletion?.tasks.find((t) => t._id.toString() === taskID);

      if (taskStillExists) {
        await res.status(500).json({ message: "Failed to delete task" });
      }


      // Emit the event to notify clients about the deleted task
      const io = getSocketIO();
      if (io) {
        io.emit("delete-task", {
          userID: (user._id as Types.ObjectId).toString(),
          boardID: boardID,
          columnID: columnID,
          taskID: taskID, // Emit the task ID that was deleted
          task: taskID // Optionally, send the deleted task data if needed on the client-side
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
        message: 'Task deleted successfully',
        user: userWithoutPassword
      });
    }


  } catch (error: any) {
    console.error('Error occurred while deleting task:', error);  // Log the error for debugging
    if (error.name === 'CastError') {
      await res.status(404).json({ message: 'User not found' }); // Handle cast errors, like invalid ObjectId
    }
    await res.status(500).json({ message: 'Server error', error });
  }
}

export default DeleteTaskController;
