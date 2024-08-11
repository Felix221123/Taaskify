import { RequestHandler, NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import UserBoardModel from "../../Models/UserModel";



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
    next(Error(
      `A user with this email already exist`
    ))
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

    return user.save()
    .then(user => {
      return res.status(201).json({
        user
      })
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
