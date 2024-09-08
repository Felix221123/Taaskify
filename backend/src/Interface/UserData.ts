import { ObjectId } from 'mongoose';


export interface Subtask {
  _id: string | ObjectId; // MongoDB's ObjectId as a string
  title: string;
  isCompleted: boolean;
}


export interface Task {
  _id: string | ObjectId; // MongoDB's ObjectId as a string
  title: string | undefined;
  description: string | undefined;
  status: string | undefined;
  subtasks: Subtask[];
}


export interface ColumnProps {
  _id: string | ObjectId; // MongoDB's ObjectId as a string
  name: string;
  tasks: Task[];
}


export interface BoardProps {
  _id: string | ObjectId; // MongoDB's ObjectId as a string
  name: string;
  columns: ColumnProps[];
}


export interface User {
  _id: string | ObjectId; // MongoDB's ObjectId as a string
  emailAddress: string;
  firstName: string;
  lastName: string;
  boards: BoardProps[];
  createdAt: Date;
  updatedAt: Date;
}
