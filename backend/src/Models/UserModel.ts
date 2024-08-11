import mongoose , {  Schema, Model } from 'mongoose';
import BoardSchema from './BoardModel';
import { IUser } from '../Interface/UserProps';

const UserBoardSchema: Schema = new Schema({
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  boards: [{ type: BoardSchema, required: true }] // Embedding boards directly within the user
}, { timestamps: true });


// creating the model for users
const UserBoardModel: Model<IUser> = mongoose.model<IUser>("UserBoard", UserBoardSchema);

export default UserBoardModel;
