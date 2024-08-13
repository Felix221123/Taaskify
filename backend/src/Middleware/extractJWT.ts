import { NextFunction, Request, Response, } from 'express';
import logging from '../Config/logging';
import jwt from "jsonwebtoken"
import config from '../Config/config';
import UserBoardModel from '../../src/Models/UserModel';


// defining a namespace
const NAMESPACE = "Auth"


const extractJWT = (req: Request, res: Response,next:NextFunction) => {
  logging.info(NAMESPACE, "Validating token");

  // defining the token here
  const token = req.headers.authorization?.split(" ")[1];

  // countering token error
  if (token){
    jwt.verify(token , config.server.token.secret, async (error, decoded) => {
      if (error){
        return res.status(404).json({
          message : error.message,
          error
        })
      } else if (decoded && typeof decoded === 'object' && '_id' in decoded) {
        // Type guard to ensure decoded is an object and contains _id
        res.locals.jwt = decoded;
        console.log(decoded);

        try {
          const user = await UserBoardModel.findById(decoded._id); // Using the decoded token's _id

          if (!user) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          req.user = user; // Attach user to the request object
          next();
        } catch (dbError) {
          return res.status(500).json({
            message: "Database error",
            error: dbError,
          });
        }
      } else {
        return res.status(401).json({
          message: "Unauthorized: Token is invalid",
        });
      }
    })
  }
  else {
    return res.status(401).json({
      message : "User Unauthorised"
    });
  }
}

export default extractJWT
