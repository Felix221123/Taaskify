import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { logInRoute, logOutRoute, signUpRoute } from './Routes/User/UsersRoutes';


// defining the express app
const app = express()


// using cors in app
app.use(cors())


// making the app use json formatting data
app.use(express.json());


// Endpoint to create all routes to server
// endpoint routes for users to sign up
app.use("/api/user/" , signUpRoute)

// endpoint routes for users to log in
app.use("/api/user/" , logInRoute)

// endpoint routes for users to logout
app.use("/api/user/" , logOutRoute)























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

