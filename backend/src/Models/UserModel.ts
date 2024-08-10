import { model, Schema } from 'mongoose';
import BoardSchema from './BoardModel';
import { IUser } from '../Interface/UserProps';

const UserBoardSchema: Schema = new Schema<IUser>({
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  boards: [BoardSchema], // Embedding boards directly within the user
}, { timestamps: true });


// creating the model for users
const UserBoardModel = model<IUser>("UserBoard", UserBoardSchema);

export default UserBoardModel;
