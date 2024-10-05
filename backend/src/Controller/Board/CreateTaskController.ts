import { NextFunction, Request, RequestHandler, Response } from "express"
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { User } from '../../Interface/UserData';
import { Types } from "mongoose";




const CreateTaskController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { userID, boardID, columnID, taskTitle, description, subtasks } = req.body;

  try {

    // Validate the input
    if (!userID || !boardID || !columnID || !taskTitle) {
      await res.status(400).json({ message: 'Invalid input: Missing required fields' });
    }

    // Validate that subtasks are provided
    if (!subtasks || subtasks.length === 0) {
      await res.status(400).json({ message: 'Invalid input: At least one subtask is required' });
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

    // Create the new task
    const newTask = {
      title: taskTitle,
      description: description || "",
      status: column._id, // The status is derived from the column name
      subtasks: subtasks.map((subtask: { title: string }) => ({
        title: subtask.title,
        isCompleted: false
      }))
    };

    // Add the new task to the column's tasks array
    column.tasks.push(newTask);

    // Save the updated user document
    await user.save();


    // Fetch the updated user with full board data (including tasks and id)
    const updatedUser = await UserBoardModel.findById(userID).lean();

    if (!updatedUser || typeof updatedUser !== "object" || !("boards" in updatedUser)) {
      await res.status(500).json({ message: "Failed to retrieve updated user data" });
    }

    const safeUpdatedUser = updatedUser as unknown as User;

    // Find the board from the updated user
    const updatedBoard = safeUpdatedUser.boards.find((b) => b._id.toString() === boardID);

    if (!updatedBoard) {
      await res.status(404).json({ message: "Board not found in updated user" });
    }

    // Find the column within the updated board
    const updatedColumn = updatedBoard?.columns.find((c) => c._id.toString() === columnID);

    if (!updatedColumn) {
      await res.status(404).json({ message: "Column not found in updated board" });
    }

    // Get the newly created task (last item in the tasks array)
    const createdTask = updatedColumn?.tasks[updatedColumn.tasks.length - 1];

    // Emit the "new-task" event to notify connected clients
    const io = getSocketIO();
    if (io) {
      io.emit("new-task", {
        userID: (user._id as Types.ObjectId).toString(),
        boardID: updatedBoard?._id.toString(),
        columnID: updatedColumn?._id.toString(),
        task: createdTask, // Send the newly created task
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
    await res.status(201).json({
      user: userWithoutPassword
    });
    }



  } catch (error) {
    await res.status(500).json({ message: 'Server error', error });
  }

}




export default CreateTaskController
