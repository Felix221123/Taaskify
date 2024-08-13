import { RequestHandler, NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import logging from "../../Config/logging";


// defining namespace
const NAMESPACE = "Auth"

const LogInUserController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { emailAddress, password } = req.body;

  if (!emailAddress || !password) {
    next(Error("Parameters missing"))
  }

  try {
    // accessing the users email from the database
    const users = await UserBoardModel.find({ emailAddress }).exec();

    // if the user doesn't exist, it prints out error
    if (users.length !== 1) {
      return res.status(401).json({
        message: "Invalid Email or Password"
      });
    }

    // accessing the users info if they exist
    const user = users[0];


    // matching the users entered password to make sure they match whats in the database
    const isMatch = await bcryptjs.compare(password, user.password);

    // if it doesn't match then it prints error message
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password"
      });
    }

    // using the sign jwt to assign a token to the user
    signJWT(user, (error, token) => {
      if (error) {
        logging.error(NAMESPACE, "Unable to sign token", error);

        return res.status(500).json({
          message: "Unable to sign token",
          error: error
        });
      } else if (token) {
        return res.status(200).json({
          message: "Auth Successful",
          token,
          user
        });
      }
    });

  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}



export default LogInUserController
