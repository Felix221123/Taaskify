import express from "express"
import LogOutUserController from "../../Controller/User/LogOutUserController";
import LogInUserController from "../../Controller/User/LogInUserController";
import SignUpUserController from "../../Controller/User/SignUpUserController";
import ValidateToken from "../../Functions/UserValidToken";
import extractJWT from "../../Middleware/extractJWT";
import UpdatePasswordForLoggedInUsersController from "../../Controller/User/UpdatePasswordForLoggedInUsersController";
import ForgotPasswordController from "../../Controller/User/ForgotPasswordController";
import ResetPasswordController from "../../Controller/User/ResetPasswordController";



// defining the router
const router = express.Router();


// router to validate token for users
export const validateTokenRoute = router.get("/validate", extractJWT , ValidateToken)

// router for signing up users
export const signUpRoute = router.post("/signup" , SignUpUserController);


// router for logging in users
export const logInRoute = router.post("/login" , LogInUserController)


// router for logging out users
export const logOutRoute = router.post("/logout",extractJWT, LogOutUserController)


// router for user to update their password
export const updatePasswordRoute = router.post("/update-password", extractJWT , UpdatePasswordForLoggedInUsersController)


// router for forgot password (No JWT required)
export const forgotPasswordRoute = router.post("/forgot-password", ForgotPasswordController);

// router for resetting user password
export const resetPasswordRoute = router.post("/reset-password", ResetPasswordController)
