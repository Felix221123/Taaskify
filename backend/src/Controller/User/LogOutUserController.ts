import { RequestHandler, NextFunction, Request, Response } from "express";


const LogOutUserController: RequestHandler = (_req: Request, res: Response, _next: NextFunction) => {
  // Clear the JWT cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // The client should remove the token, but here you can still send a response indicating success
  return res.status(200).json(
    { message: "User logged out successfully" }
  );
};




export default LogOutUserController;
