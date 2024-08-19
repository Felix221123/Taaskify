import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { forgotPasswordRoute, logInRoute, logOutRoute, signUpRoute, updatePasswordRoute, validateTokenRoute } from './Routes/User/UsersRoutes';
import { createBoardRoute } from './Routes/Board/BoardRoutes';


// defining the express app
const app = express()

// using the cookie parser in express
app.use(cookieParser());

// using cors in app
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
}));


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








// endpoint routes for users board routes
app.use("/api/board/" , createBoardRoute);





















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



export const Add = (a: number, b: number) => {
  return a + b
}





export default app;

