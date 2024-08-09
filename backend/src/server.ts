import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'

// defining the express app
const app = express()

// using cors in app
app.use(cors())


// making the app use json formatting data
app.use(express.json());


// using the next function to catch errors
app.use((error:unknown,req: Request, res: Response,next:NextFunction) => {
  console.error(error);
  let errorMessage = "An error occurred";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({error:errorMessage});
  next(error);
})



// when endpoint is not found
app.use((req: Request, res: Response,next:NextFunction) => {
  next(Error("Endpoint not found"));
})



export const Add = (a: number, b: number) => {
  return a + b
}








export default app;

