import { RequestHandler,NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import signJWT from "../../Functions/signJWT";
import config from "../../Config/config";


const UpdatePasswordForLoggedInUsersController:RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {

  // creating a password body structuring
  const { currentPassword, newPassword } = req.body;

  // making sure the users current and new password is present
  if (!currentPassword || !newPassword) {
    await res.status(400).json({ message: "Parameters missing" });
  }

  // requesting the user object to make sure they have already authenticated
  const user = req.user;

  // actions to take if users hasn't been authenticated yet
  if (!user) {
    console.log("User not found in request");
    await res.status(404).json({ message: "User not found" });
  } else {

    // using the try and catch block to assign the new password to the users object in the database
  try {
    // compare the current password and the one stored in the database to make sure its the same
    const isMatch = await bcryptjs.compare(currentPassword, user.password);

    // using to if statement if the password doest match the current one in the database
    if (!isMatch){
      await res.status(401).json(
        { message: "Current password is incorrect" }
      );
    } else {

      // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // Remove the password from the user object before returning it
    const userWithoutPassword:any = {
      _id: user._id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      boards: user.boards,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
    };;


    // Issue a new JWT after password update
    signJWT(user, (error, token) => {
      if (error) {
        return res.status(500).json({
          message: "Unable to sign token",
          error: error,
        });
      } else if (token) {
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: config.server.node_env === "production",    // Ensures the cookie is sent only over HTTPS, make this true during production
          sameSite: "strict",
          maxAge: 1000 * 60 * 60, // 1 hour
        });

        return res.status(200).json({
          message: "Password updated successfully",
          user:userWithoutPassword,
        });
      }
    });
    }
  }
  catch (error) {
    await res.status(500).json({
      error
    })
  }
  }

}



export default UpdatePasswordForLoggedInUsersController
