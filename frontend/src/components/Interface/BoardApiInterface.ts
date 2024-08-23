interface Subtask {
  title: string;
  isCompleted: boolean;
  _id: string;
}

interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
  _id: string;
}

interface Column {
  name: string;
  tasks: Task[];
  _id: string;
}

interface Board {
  name: string;
  columns: Column[];
  _id: string;
}

interface UserBoardData {
  _id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  boards: Board[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default UserBoardData;
