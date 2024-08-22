import { NextFunction, Request, RequestHandler, Response } from "express"
import UserBoardModel from "../../Models/UserModel";
// import { ColumnDataProps, BoardDataProps } from "../../Interface/BoardProps";


const CreateTaskController: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
  const { userID, boardID, columnID, taskTitle, description, subtasks } = req.body;

  try {

    // Validate the input
    if (!userID || !boardID || !columnID || !taskTitle) {
      return res.status(400).json({ message: 'Invalid input: Missing required fields' });
    }

    // Validate that subtasks are provided
    if (!subtasks || subtasks.length === 0) {
      return res.status(400).json({ message: 'Invalid input: At least one subtask is required' });
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
    const column = board.columns.id(columnID);

    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Create the new task
    const newTask = {
      title: taskTitle,
      description: description || "",
      status: column.name, // The status is derived from the column name
      subtasks: subtasks.map((subtask: { title: string }) => ({
        title: subtask.title,
        isCompleted: false
      }))
    };

    // Add the new task to the column's tasks array
    column.tasks.push(newTask);

    // Save the updated user document
    await user.save();

    // Return the updated user document
    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }


}

export default CreateTaskController
