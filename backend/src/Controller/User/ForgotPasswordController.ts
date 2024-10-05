import { RequestHandler, NextFunction, Request, Response } from "express";
import logging from "../../Config/logging"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import { sendEmail } from "../../Services/EmailService";
import { capitalizeFirstLetter } from "../../utils/CapitaliseFirstLetter";
import config from "../../Config/config";


const NAMESPACE = "Auth";


const ForgotPasswordController: RequestHandler = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { emailAddress } = req.body;

  if (!emailAddress) {
    await res.status(400).json({ message: "Email address is required" });
  }

  try {
    const user = await UserBoardModel.findOne({ emailAddress }).exec();

    if (!user) {
      await res.status(404).json({
        message: "User with that email does not exist"
      });
    } else {

      const firstName = user?.firstName ? capitalizeFirstLetter(user.firstName) : "User";

      // Generate a JWT reset token using signJWT function
      signJWT(user, async (error: any, resetToken) => {
        if (error || !resetToken) {
          logging.error(NAMESPACE, "Unable to sign reset token", error);
          await res.status(500).json({
            message: "Unable to sign reset token",
            error: error,
          });
        }

        // Send the email with the reset link
        const resetURL = `${config.server.base_url}/reset-password?token=${resetToken}`;
        const emailTemplate = `
        <html>
        <body style="font-family: Arial, sans-serif;">
          <div>
            <p>Dear ${firstName},</p>
            <p>We received a request to reset your password for your Taaskify account. To proceed, simply click on the button below:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetURL}" style="background-color: #007BFF; color: white; font-weight: 900; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please disregard this email. Your account will remain secure.</p>
            <p>Should you require any assistance, please don’t hesitate to contact our support team at contact@taaskify.com.</p>
            <br/>
            <p>Best Regards,</p>
            <p>Felix Baah<br/>Founder of Taaskify<br/>Taaskify.</p>
          </div>
        </body>
        </html>
      `;

        // Send the email with the reset link
        sendEmail(
          [emailAddress],
          "Password Reset Request",
          emailTemplate
        )
          .then(() => {
            logging.info(NAMESPACE, "Password reset email sent to " + emailAddress);
            return res.status(200).json({ message: "Password reset email sent", resetToken });
          })
          .catch((emailError) => {
            logging.error(NAMESPACE, "Error sending password reset email", emailError);
            return res.status(500).json({ message: "Error sending password reset email", error: emailError });
          });
      });
    }



  } catch (error: any) {
    logging.error(NAMESPACE, "Error processing forgot password request", error);
    await res.status(500).json({ message: "Error processing request", error });
  }


}



export default ForgotPasswordController;
