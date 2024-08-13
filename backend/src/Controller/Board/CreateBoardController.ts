import { NextFunction, Request, RequestHandler, Response } from "express"
import UserBoardModel from "../../Models/UserModel";


const CreateBoardController:RequestHandler = async (req:Request, res:Response, _next:NextFunction) => {

  try {
    const { userID, name, columns } = req.body;

    // Validate the input
    if (!userID || !name || !columns || !Array.isArray(columns) || columns.length === 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // find user by ID and update its board
    const user = await UserBoardModel.findById(userID);

    // making sure the user is found
    if (!user){
      return res.status(404).json({ message: 'User not found' });
    };

    // Create a new board object
    const newBoard = {
      name,
      columns
    };

    // Add the new board to the user's boards array
    user.boards.push(newBoard);

    // Save the updated user document
    await user.save();

    // Return the updated user document
    return res.status(201).json(user);


  } catch (error) {
    return res.status(500).json(
      { message: 'Server error', error }
    );
  }

}

export default CreateBoardController