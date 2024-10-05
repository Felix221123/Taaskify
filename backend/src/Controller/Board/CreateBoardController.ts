import { NextFunction, Request, RequestHandler, Response } from "express"
import UserBoardModel from "../../Models/UserModel";
import { getSocketIO } from "../../socket";
import { User } from '../../Interface/UserData';
import { Types } from "mongoose";



const CreateBoardController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {

  try {
    const { userID, name, columns } = req.body;

    // Validate the input
    if (!userID || !name) {
      await res.status(400).json({ message: 'Invalid input' });
    }

    // find user by ID and update its board
    const user = await UserBoardModel.findById(userID);

    // making sure the user is found
    if (!user) {
      await res.status(404).json({ message: 'User not found' });
    } else {
      // Create a new board object
    const newBoard = {
      name,
      columns: columns || []
    };

    // Add the new board to the user's boards array
    user.boards.push(newBoard);

    // Save the updated user document
    await user.save();

    // Fetch the updated user with full board data (including tasks and id)
    const updatedUser = await UserBoardModel.findById(userID).lean();

    // Narrow the type using type guards or manual checking
    if (updatedUser === null || typeof updatedUser !== 'object' || !('boards' in updatedUser)) {
      await res.status(500).json({ message: "Failed to retrieve updated user data" });
    }

    // Since we validated that `updatedUser` has `boards`, we can cast it as `User` safely
    const safeUpdatedUser = updatedUser as unknown as User;

    // Get the newly created board with its id
    const createdBoard = safeUpdatedUser.boards.find((board) => board.name === name);

    if (!createdBoard) {
      await res.status(500).json({ message: "Board creation failed" });
    }


    const io = getSocketIO(); // Call getSocketIO after initSocket was called in server.ts
    if (io) {
      io.emit("new-board", {
        userID: (user._id as Types.ObjectId).toString(),
        board: createdBoard
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
    await res.status(500).json(
      { message: 'Server error', error }
    );
  }
}





export default CreateBoardController
