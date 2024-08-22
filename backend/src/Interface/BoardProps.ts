// import mongoose from "mongoose";

export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  title: string | undefined;
  description: string | undefined;
  status: string | undefined;
  subtasks: Subtask[];
}

export interface ColumnProps {
  name: string;
  tasks: Task[];
}

export interface BoardProps {
  name: string;
  columns: ColumnProps[];
}




// export interface ColumnDataProps {
//   name: string;
//   tasks: Task[];
//   _id: mongoose.Types.ObjectId; // Ensure _id is typed
// }

// export interface BoardDataProps {
//   name: string;
//   columns: ColumnDataProps[];
//   _id: mongoose.Types.ObjectId; // Ensure _id is typed
// }


