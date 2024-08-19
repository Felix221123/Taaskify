import { NextFunction, Request, Response } from 'express';
import logging from "../Config/logging"


const NAMESPACE = "user"


const ValidateToken = (req: Request, res: Response, _next:NextFunction) => {
  logging.info(NAMESPACE, "Token Validated, user authorized");

  // Since extractJWT middleware already validated the token, we can just confirm the authorization
  return res.status(200).json({
    message: "User Authorized",
    user: req.user, // Optionally, return the user information
  });
};

export default ValidateToken;
