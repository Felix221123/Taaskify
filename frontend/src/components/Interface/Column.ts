import { TaskProps } from './AddTaskInterface';
import { BoardProps } from './Boards';

export interface ColumnProps {
  name: string;
  tasks: TaskProps[];
  boards:BoardProps[]
}

export interface ColumnDataProps {
  name: string;
  tasks: TaskProps[];
  _id:string;
}


