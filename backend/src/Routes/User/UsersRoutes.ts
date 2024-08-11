import LogOutUserController from "../../Controller/User/LogOutUserController";
import LogInUserController from "../../Controller/User/LogInUserController";
import SignUpUserController from "../../Controller/User/SignUpUserController";
import ValidateToken from "../../Functions/UserValidToken";
import extractJWT from "../../Middleware/extractJWT";
import express from "express"


// defining the router
const router = express.Router();


// router to validate token for users
export const validateTokenRoute = router.get("/validate", extractJWT , ValidateToken)

// router for signing up users
export const signUpRoute = router.post("/signup" , SignUpUserController);


// router for logging in users
export const logInRoute = router.post("/login" , LogInUserController)


// router for logging out users
export const logOutRoute = router.post("/logout", LogOutUserController)





