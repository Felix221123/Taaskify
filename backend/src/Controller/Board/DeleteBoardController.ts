import { NextFunction, Request, RequestHandler, Response } from "express";
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { Types } from "mongoose";
import { User } from '../../Interface/UserData';



const DeleteBoardController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const { userID, boardID } = req.body;

    // Validate the input
    if (!userID || !boardID) {
      await res.status(400).json({ message: 'Invalid input' });
    }

    // Find the user by ID
    const user = await UserBoardModel.findById(userID);

    // Ensure the user exists
    if (!user) {
      await res.status(404).json({ message: 'User not found' });
    } else {

      // Find the index of the board to be deleted
      const boardIndex = user.boards.findIndex((board: any) => board._id.toString() === boardID);

      // Ensure the board exists
      if (boardIndex === -1) {
        await res.status(404).json({ message: 'Board not found' });
      }

      // const deletedBoard = user.boards[boardIndex]; // Store the board info before deleting it
      user.boards.splice(boardIndex, 1);

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

      // Find the deleted board to ensure it was removed
      const deletedBoard = safeUpdatedUser.boards.find((board) => board._id.toString() === boardID);

      if (deletedBoard) {
        await res.status(500).json({ message: "Failed to delete board" });
      }

      // Emit the event to notify clients about the deleted board
      const io = getSocketIO();
      if (io) {
        io.emit("delete-board", {
          userID: (user._id as Types.ObjectId).toString(),
          boardID: boardID, // Emit the board ID to the client
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
        message: 'Board deleted successfully',
        user: userWithoutPassword
      });
    }



  } catch (error) {
    await res.status(500).json(
      { message: 'Server error', error }
    );
  }
}

export default DeleteBoardController;
