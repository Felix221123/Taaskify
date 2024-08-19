import { RequestHandler, NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import config from "../../Config/config";




const SignUpUserController:RequestHandler = async(req: Request, res: Response, next:NextFunction) => {
  const { firstName , lastName , emailAddress, password } = req.body;

  if (!firstName || !lastName || !emailAddress || !password){
    next(Error("Parameters missing"))
  }

  // preventing the same email address from being used
  const existingEmail = await UserBoardModel.findOne({
    emailAddress:emailAddress
  }).exec();

  if (existingEmail) {
    return res.status(409).json({ error: "A user with this email already exists" });
  }

  // using the bcryptjs to has passwords
  bcryptjs.hash(password, 12 ,(hashError , hash) => {
    if (hashError){
      return res.status(500).json({
        message : hashError.message,
        error:hashError
      })
    }

    // passing in new users to the database
    const user = new UserBoardModel({
      firstName,
      lastName,
      emailAddress,
      password:hash,
      boards: []
    });

    return user
      .save()
      .then((user) => {
        // Automatically log the user in by signing a JWT and setting it in a cookie
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
              sameSite: "lax",   // Ensure its turned to strict during production
              maxAge: 1000 * 60 * 60, // 1 hour
            });

            return res.status(201).json({
              message: "User registered and logged in successfully",
              user,
            });
          }
        });
      })
    .catch(error => {
      return res.status(500).json({
        message : error.message,
        error
      })
    });
  })
}



export default SignUpUserController
