import { NextFunction, Request, Response, } from 'express';
import logging from '../Config/logging';
import jwt from "jsonwebtoken"
import config from '../Config/config';
import UserBoardModel from '../../src/Models/UserModel';


// defining a namespace
const NAMESPACE = "Auth"


const extractJWT = (req: Request, res: Response,next:NextFunction) => {
  logging.info(NAMESPACE, "Validating token");

  // Retrieve the token from the cookie
  const token = req.cookies.authToken;


  // countering token error
  jwt.verify(token, config.server.token.secret, async (error:any, decoded:any) => {
    if (error) {
      return res.status(404).json({
        message: error.message,
        error,
      });
    } else if (decoded && typeof decoded === 'object' && '_id' in decoded) {
      res.locals.jwt = decoded;

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
  });
}

export default extractJWT
