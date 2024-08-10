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

  UserBoardModel.find({ emailAddress })
    .exec()
    .then(users => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: "User Unauthorised"
        })
      }

      bcryptjs.compare(password, users[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "User Unauthorised"
          })
        }
        else if (result) {
          signJWT(users[0], (error, token) => {
            if (error) {
              logging.error(NAMESPACE, "Unable to sign token", error);

              return res.status(401).json({
                message: "Unauthorised",
                error: error
              })
            }
            else if (token) {
              res.status(200).json({
                message: "Auth Successful",
                token,
                user: users[0]
              })
            }
          })
        }
      })
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error
      })
    });
}




export default LogInUserController
