import { RequestHandler, NextFunction, Request, Response } from "express";
import config from "../../Config/config";



const LogOutUserController: RequestHandler = async(req: Request, res: Response, _next: NextFunction) => {

  if (req.user) {
    req.user.currentSessionToken = null;
    await req.user.save();
  }


  // Clear the JWT cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: config.server.node_env === "production",          // Ensures the cookie is sent only over HTTPS, make this true during production
    sameSite: "lax",
  });

  // The client should remove the token, but here you can still send a response indicating success
  return res.status(200).json(
    { message: "User logged out successfully" }
  );
};




export default LogOutUserController;
