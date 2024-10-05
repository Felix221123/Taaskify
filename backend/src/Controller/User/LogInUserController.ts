import { RequestHandler, NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import logging from "../../Config/logging";
import config from "../../Config/config";


// defining namespace
const NAMESPACE = "Auth"

const LogInUserController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { emailAddress, password } = req.body;

  if (!emailAddress || !password) {
    res.status(400).json({ message: "Parameters missing" });
  }

  try {
    // accessing the users email from the database
    const users = await UserBoardModel.find({ emailAddress }).exec();

    // if the user doesn't exist, it prints out error
    if (users.length !== 1) {
      res.status(401).json({
        message: "Invalid Email or Password"
      });
    }

    // accessing the users info if they exist
    const user = users[0];


    // matching the users entered password to make sure they match whats in the database
    const isMatch = bcryptjs.compare(password, user.password);

    // if it doesn't match then it prints error message
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid Email or Password"
      });
      return;
    }

    // Remove the password from the user object before ng it
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

    // using the sign jwt to assign a token to the user
    signJWT(user, async(error, token) => {
      if (error) {
        logging.error(NAMESPACE, "Unable to sign token", error);

        res.status(500).json({
          message: "Unable to sign token",
          error: error
        });
      }
      else if (token) {
        // Save the new session token to the user in the database
        user.currentSessionToken = token;
        user.save();

        // Store JWT in an HttpOnly cookie
        const oneHourFromNow = new Date(Date.now() + 1000 * 60 * 60);
        res.cookie("authToken", token, {
          httpOnly: true, // Cannot be accessed via JavaScript
          secure: config.server.node_env === "production",   // Ensures the cookie is sent only over HTTPS, make this true during production
          expires: oneHourFromNow,
          sameSite: "strict", // Helps prevent CSRF attacks
          maxAge: 1000 * 60 * 60, // 1 hour
        });

        res.status(200).json({
          message: "Auth Successful",
          user:userWithoutPassword,
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      error
    });
  }
}



export default LogInUserController
