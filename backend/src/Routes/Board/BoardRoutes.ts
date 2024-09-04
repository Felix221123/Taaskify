import express from "express"
import ValidateToken from "../../Functions/UserValidToken";
import extractJWT from "../../Middleware/extractJWT";
import CreateBoardController from "../../Controller/Board/CreateBoardController";
import CreateTaskController from "../../Controller/Board/CreateTaskController";
import DeleteBoardController from "../../Controller/Board/DeleteBoardController";
import DeleteTaskController from "../../Controller/Board/DeleteTaskController";
import EditBoardController from "../../Controller/Board/EditBoardController";
import EditTaskController from "../../Controller/Board/EditTaskController";
import UpdateSubtaskStatusController from "../../Controller/Board/UpdateSubtaskStatusController";



// defining the router here
const router = express.Router();


// router to validate token for users
export const validateTokenRoute = router.get("/validate", extractJWT , ValidateToken)

// router to create new board for users
export const createBoardRoute = router.post("/createboard" , CreateBoardController)

// router to create new task in a board for users
export const createTaskRoute = router.post("/createtask" , CreateTaskController)

// router to delete boards for users
export const deleteBoardRoute = router.delete("/deleteboard" , DeleteBoardController)

// router to delete task for users
export const deleteTaskRoute = router.delete("/deletetask" , DeleteTaskController)

// router to edit board for users
export const editBoardRoute = router.patch("/editboard" , EditBoardController)

// router to edit task for users
export const editTaskRoute = router.patch("/edittask" , EditTaskController)

// router to update the status of a subtask for users
export const updateSubtaskStatusRoute = router.put("/update-subtask-status" , UpdateSubtaskStatusController)
