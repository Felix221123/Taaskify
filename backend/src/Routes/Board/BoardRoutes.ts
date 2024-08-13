import express from "express"
import ValidateToken from "../../Functions/UserValidToken";
import extractJWT from "../../Middleware/extractJWT";
import CreateBoardController from "../../Controller/Board/CreateBoardController";



// defining the router here
const router = express.Router();


// router to validate token for users
export const validateTokenRoute = router.get("/validate", extractJWT , ValidateToken)


// router to create new board for users
export const createBoardRoute = router.post("/createboard" , CreateBoardController)
