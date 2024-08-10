import { RequestHandler, NextFunction, Request, Response } from "express";


const LogOutUserController: RequestHandler = (req: Request, res: Response, _next: NextFunction) => {
  // Assuming the token is sent in the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(400).json(
      { message: "No token provided" }
    );
  }

  // The client should remove the token, but here you can still send a response indicating success
  return res.status(200).json(
    { message: "User logged out successfully" }
  );
};




export default LogOutUserController;
