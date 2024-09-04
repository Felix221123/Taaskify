import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";




const DeleteBoardController: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { userID, boardID } = req.body;

    // Validate the input
    if (!userID || !boardID) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Find the user by ID
    const user = await UserBoardModel.findById(userID);

    // Ensure the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the board to be deleted
    const boardIndex = user.boards.findIndex((board:any) => board._id.toString() === boardID);

    // Ensure the board exists
    if (boardIndex === -1) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Remove the board from the user's boards array
    user.boards.splice(boardIndex, 1);

    // Save the updated user document
    await user.save();

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
      message: 'Board deleted successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    return res.status(500).json(
      { message: 'Server error', error }
    );
  }
}

export default DeleteBoardController;
