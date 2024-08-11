import { NextFunction, Request, Response, } from 'express';
import logging from '../Config/logging';
import jwt from "jsonwebtoken"
import config from '../Config/config';



// defining a namespace
const NAMESPACE = "Auth"


const extractJWT = (req: Request, res: Response,next:NextFunction) => {
  logging.info(NAMESPACE, "Validating token");

  // defining the token here
  const token = req.headers.authorization?.split(" ")[1];

  // countering token error
  if (token){
    jwt.verify(token , config.server.token.secret, (error, decoded) => {
      if (error){
        return res.status(404).json({
          message : error.message,
          error
        })
      } else {
        res.locals.jwt = decoded;
        next();
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
