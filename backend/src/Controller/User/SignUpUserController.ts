import { RequestHandler, NextFunction, Request, Response } from "express"
import bcryptjs from "bcryptjs"
import UserBoardModel from "../../Models/UserModel";
import signJWT from "../../Functions/signJWT";
import config from "../../Config/config";
import { sendEmail } from "../../Services/EmailService";
import jwt from "jsonwebtoken"



const SignUpUserController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, emailAddress, password } = req.body;

  if (!firstName || !lastName || !emailAddress || !password) {
    next(Error("Parameters missing"))
  }

  // preventing the same email address from being used
  const existingEmail = await UserBoardModel.findOne({
    emailAddress: emailAddress
  }).exec();

  if (existingEmail) {
    return res.status(409).json({ error: "A user with this email already exists" });
  }

  // Check if another user is currently logged in by verifying the current token
  const token = req.cookies.authToken;
  if (token) {
    jwt.verify(token, config.server.token.secret, async (error: any, decoded: any) => {
      if (!error && decoded && decoded._id) {
        const loggedInUser = await UserBoardModel.findById(decoded._id).exec();
        if (loggedInUser) {
          // Invalidate the session for the currently logged-in user
          loggedInUser.currentSessionToken = null;
          await loggedInUser.save();
        }
      }
    });
  }

  // using the bcryptjs to has passwords
  bcryptjs.hash(password, 12, (hashError, hash) => {
    if (hashError) {
      return res.status(500).json({
        message: hashError.message,
        error: hashError
      })
    }

    // passing in new users to the database
    const user = new UserBoardModel({
      firstName,
      lastName,
      emailAddress,
      password: hash,
      boards: []
    });

    // Remove the password from the user object before returning it
    const userWithoutPassword = {
      _id: user._id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      boards: user.boards,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
    };

    return user
      .save()
      .then((user) => {
        // Automatically log the user in by signing a JWT and setting it in a cookie
        signJWT(user, async (error, token) => {
          if (error) {
            return res.status(500).json({
              message: "Unable to sign token",
              error: error,
            });
          }
          else if (token) {
            // Assign the new token and save it in the user's `currentSessionToken`
            user.currentSessionToken = token;
            await user.save();

            res.cookie("authToken", token, {
              httpOnly: true,
              secure: config.server.node_env === "production",    // Ensures the cookie is sent only over HTTPS, make this true during production
              sameSite: "lax",   // Ensure its turned to strict during production
              maxAge: 1000 * 60 * 60, // 1 hour
            });

            // Send welcome email
            const emailTemplate = `
              <html>
              <body style="font-family: Arial, sans-serif;">
                <div style="text-align: center;">
                  <h2 style="color: #007BFF;">🎉 Welcome to Taaskify, ${firstName}! 🎉</h2>
                  <p>We’re absolutely thrilled to have you join our community! 🌟</p>
                  <p>With Taaskify, managing your tasks / projects just got a whole lot easier.</p>
                  <p>Your journey to productivity starts now! 🚀 We can’t wait to see all the amazing things you’ll achieve with us.</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${config.server.base_url}/taaskify" style="background-color: #007BFF; color: white; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Your Dashboard</a>
                  </div>
                  <p>If you need any help along the way, don't hesitate to reach out. Our support team is here for you at contact@taaskify.com. 💬</p>
                  <p>Let’s make productivity fun and effective! 💪✨</p>
                  <br/>
                  <p>Cheers,</p>
                  <p>Felix Baah<br/>Founder of Taaskify 🚀</p>
                </div>
              </body>
              </html>`;

              try {
                await sendEmail([emailAddress], "Welcome to Taaskify", emailTemplate);
                console.log("Welcome email sent to " + emailAddress);
              } catch (emailError) {
                console.error("Error sending welcome email", emailError);
              }

            return res.status(201).json({
              message: "User registered and logged in successfully",
              user: userWithoutPassword,
            });
          }
        });
      })
      .catch(error => {
        return res.status(500).json({
          message: error.message,
          error
        })
      });
  })
}



export default SignUpUserController
