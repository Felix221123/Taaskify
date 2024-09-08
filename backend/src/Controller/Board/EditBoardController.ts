import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { User } from '../../Interface/UserData';
import { Types } from "mongoose";



const EditBoardController: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { userID, boardID, name, columns } = req.body;

    // Validate the input
    if (!userID || !boardID || !name) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Find user by ID
    const user = await UserBoardModel.findById(userID);

    // Ensure the user is found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the board to be edited
    const board = user.boards.id(boardID) as any;

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Update the board's name and columns
    board.name = name;
    board.columns = columns;


    // Save the updated user document
    await user.save();

    // Fetch the updated user with full board data (including tasks and id)
    const updatedUser = await UserBoardModel.findById(userID).lean();

    // Validate that the updated user is found
    if (!updatedUser || !updatedUser.boards) {
      return res.status(500).json({ message: 'Failed to retrieve updated user data' });
    }

    // Since we validated that `updatedUser` has `boards`, we can cast it as `User` safely
    const safeUpdatedUser = updatedUser as unknown as User;

    // Find the updated board in the user's boards
    const updatedBoard = safeUpdatedUser.boards.find((b) => b._id?.toString() === boardID);

    if (!updatedBoard) {
      return res.status(500).json({ message: 'Board update failed' });
    }

    // Emit the updated board details to all connected clients via Socket.IO
    const io = getSocketIO();
    if (io) {
      io.emit('update-board', {
        userID: (user._id as Types.ObjectId).toString(),
        board: updatedBoard
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
      user: userWithoutPassword,
    });

  } catch (error) {
    return res.status(500).json(
      { message: 'Server error', error }
    );
  }
}

export default EditBoardController;
