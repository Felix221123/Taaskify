import { NextFunction, Request, Response } from 'express';
import logging from '../Config/logging';


const NAMESPACE = 'user';

const ValidateToken = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  logging.info(NAMESPACE, 'Token Validated, user authorized');

  if (!req.user) {
    await res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // Remove the password from the user object before returning it
  const userWithoutPassword = {
    _id: req.user?._id,
    emailAddress: req.user?.emailAddress,
    firstName: req.user?.firstName,
    lastName: req.user?.lastName,
    boards: req.user?.boards,
    createdAt: req.user?.createdAt,
    updatedAt: req.user?.updatedAt,
    __v: req.user?.__v,
  };

  // Since extractJWT middleware already validated the token, we can just confirm the authorization
  await res.status(200).json({
    message: 'User Authorized',
    user: userWithoutPassword, // Return the user information without the password
  });
};

export default ValidateToken;
