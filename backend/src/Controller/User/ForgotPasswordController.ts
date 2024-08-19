import { RequestHandler, NextFunction, Request, Response } from "express";
import logging from "../../Config/logging"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import { sendEmail } from "../../Services/EmailService";


const NAMESPACE = "Auth";


const ForgotPasswordController: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
  const { emailAddress } = req.body;

  if (!emailAddress) {
    return res.status(400).json({ message: "Email address is required" });
  }

  try {
    const user = await UserBoardModel.findOne({ emailAddress }).exec();

    if (!user) {
      return res.status(404).json({ message: "User with that email does not exist" });
    }

    // Generate a JWT reset token using signJWT function
    signJWT(user, (error: any, resetToken) => {
      if (error || !resetToken) {
        logging.error(NAMESPACE, "Unable to sign reset token", error);
        return res.status(500).json({
          message: "Unable to sign reset token",
          error: error,
        });
      }

      // Send the email with the reset link
      const resetURL = `https://yourdomain.com/reset-password?token=${resetToken}`;
      sendEmail(
        [emailAddress],
        "Password Reset Request",
        `
          You requested a password reset. Click the link below to reset your password.
          This link will expire in 1 hour.
          <br/><br/>
          <a href="${resetURL}">Reset Password</a>
          <br/><br/>
          If you did not request a password reset, please ignore this email.
        `
      )
        .then(() => {
          logging.info(NAMESPACE, "Password reset email sent to " + emailAddress);
          return res.status(200).json({ message: "Password reset email sent" });
        })
        .catch((emailError) => {
          logging.error(NAMESPACE, "Error sending password reset email", emailError);
          return res.status(500).json({ message: "Error sending password reset email", error: emailError });
        });
    });

  } catch (error: any) {
    logging.error(NAMESPACE, "Error processing forgot password request", error);
    return res.status(500).json({ message: "Error processing request", error });
  }

}



export default ForgotPasswordController;
