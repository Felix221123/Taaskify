import BoardSchema from 'Models/BoardModel';
import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userID: Schema.Types.ObjectId;
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  boards: typeof BoardSchema[];
}
