import { RequestHandler,NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"


const UpdatePasswordForLoggedInUsersController:RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {

  // creating a password body structuring
  const { currentPassword, newPassword } = req.body;

  // making sure the users current and new password is present
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Parameters missing" });
  }

  // requesting the user object to make sure they have already authenticated
  const user = req.user;

  // actions to take if users hasn't been authenticated yet
  if (!user) {
    console.log("User not found in request");
    return res.status(404).json({ message: "User not found" });
  }

  // using the try and catch block to assign the new password to the users object in the database
  try {
    // compare the current password and the one stored in the database to make sure its the same
    const isMatch = await bcryptjs.compare(currentPassword, user.password);

    // using to if statement if the password doest match the current one in the database
    if (!isMatch){
      return res.status(401).json(
        { message: "Current password is incorrect" }
      );
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // return a successful message indicating the users password has been updated
    return res.status(200).json(
      { message: "Password updated successfully",
        user
      },
    );


  } catch (error) {
    return res.status(500).json({
      error
    })
  }

}



export default UpdatePasswordForLoggedInUsersController
