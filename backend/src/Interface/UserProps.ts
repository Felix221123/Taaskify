import BoardSchema from 'Models/BoardModel';
import { Document } from 'mongoose';


export interface IUser extends Document {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  boards: typeof BoardSchema[];
}


export interface SignUpUserProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}


export interface LogInUsersProps{
  emailAddress: string;
  password: string;
}
