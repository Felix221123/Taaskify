import { IUser } from "../src/Interface/UserProps";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or the type that represents your User model
    }
  }
}
