import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { forgotPasswordRoute, logInRoute, logOutRoute, resetPasswordRoute, signUpRoute, updatePasswordRoute, validateTokenRoute } from './Routes/User/UsersRoutes';
import { createBoardRoute, createTaskRoute, deleteBoardRoute, deleteTaskRoute, editBoardRoute, editTaskRoute, updateSubtaskStatusRoute } from './Routes/Board/BoardRoutes';
import { initSocket } from './socket';


// defining the express app
const app = express()

// defining the server
const server = createServer(app);

// defining socket.io with CORS settings
initSocket(server);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = ['https://taaskify.com','http://localhost:5173'];

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error(`Not allowed by CORS for origin: ${origin}`)); // Block the request with an error
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));



// using the cookie parser in express
app.use(cookieParser());


// making the app use json formatting data
app.use(express.json());


// Endpoint to create all routes to server
// endpoint to check authenticated users
app.use("/api/user/", validateTokenRoute)

// endpoint routes for users to sign up
app.use("/api/user/" , signUpRoute);

// endpoint routes for users to log in
app.use("/api/user/" , logInRoute);

// endpoint routes for users to logout
app.use("/api/user/" , logOutRoute);

// end point for logged in users to update their password
app.use("/api/user/" , updatePasswordRoute)

// endpoint for users to request  a password reset where they are sent a reset link which will expire in an hour
app.use("/api/user/" , forgotPasswordRoute)

// endpoint for users to reset their password
app.use("/api/user/" , resetPasswordRoute)






// Endpoint routes for users board routes
// endpoint for users to create boards
app.use("/api/user/board/" , createBoardRoute);

// endpoint for users to create new task
app.use("/api/user/board/" , createTaskRoute)

// endpoint for users to delete task
app.use("/api/user/board/" , deleteBoardRoute);

// endpoint for users to delete task
app.use("/api/user/board/" , deleteTaskRoute);

// endpoint for users to edit board
app.use("/api/user/board/", editBoardRoute)

// endpoint for users to edit task
app.use("/api/user/board/" , editTaskRoute)

// endpoint for users to update subtask status
app.use("/api/user/board/" , updateSubtaskStatusRoute)





// using the next function to catch errors
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An error occurred";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
  next(error);
})


// when endpoint is not found
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(Error("Endpoint not found"));
})


// addition function
export const Add = (a: number, b: number) => {
  return a + b
}




// Export both the app and server
export { app, server };

