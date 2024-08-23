import { Task } from './AddTaskInterface';

export interface ColumnProps {
  name: string;
  tasks: Task[];
}

export interface ColumnDataProps {
  name: string;
  tasks: Task[];
  _id:string;
}


