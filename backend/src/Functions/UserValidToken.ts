import { NextFunction, Request, Response } from 'express';
import logging from "../Config/logging"


const NAMESPACE = "user"


const ValidateToken = (req: Request, res: Response, next:NextFunction) => {
  logging.info(NAMESPACE, "Token Validated, user authorised");

  if (!req.headers.authorization) {
    return next(new Error("User Unauthorized"));
  }

  return res.status(200).json({
    message : "User Authorised"
  });
};

export default ValidateToken;
