import { RequestHandler, NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import logging from "../../Config/logging";
import config from "../../Config/config";
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";


const NAMESPACE = "Auth";


const ResetPasswordController:RequestHandler = async(req: Request, res: Response, _next: NextFunction) => {
  // requested body needed to change your password
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, config.server.token.secret as string) as { _id: string; emailAddress: string };

    // finding the user using their id
    const user = await UserBoardModel.findById(decodedToken._id).exec();

    // throw an error if the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // Issue a new JWT after password reset
    signJWT(user, (error, token) => {
      // handles the error that occurs in handling the jwt
      if (error) {
        logging.error(NAMESPACE, "Unable to sign token", error);
        return res.status(500).json({
          message: "Unable to sign token",
          error: error,
        });
      } else if (token) {
        // Store JWT in an HttpOnly cookie
        const oneHourFromNow = new Date(Date.now() + 1000 * 60 * 60);
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: config.server.node_env === "production",   // Ensures the cookie is sent only over HTTPS, make this true during production
          expires: oneHourFromNow,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60, // 1 hour
        });

        return res.status(200).json({
          message: "Password reset successful",
        });
      }
    });


  } catch (error:any) {
    logging.error(NAMESPACE, "Error resetting password", error);
    return res.status(500).json({ message: "Error resetting password", error });
  }

}

export default ResetPasswordController
