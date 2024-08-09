import { BoardProps, ColumnProps, Subtask, Task } from 'Interface/BoardProps';
import { Schema } from 'mongoose';


// Subtask Schema
const SubtaskSchema: Schema = new Schema<Subtask>({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
});

// Task Schema
const TaskSchema: Schema = new Schema<Task>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, required: true },
  subtasks: [SubtaskSchema], // Embedding subtasks
});


// Column Schema
const ColumnSchema: Schema = new Schema<ColumnProps>({
  name: { type: String, required: true },
  tasks: [TaskSchema], // Embedding tasks
});


// Board Schema
const BoardSchema: Schema = new Schema<BoardProps>({
  name: { type: String, required: true },
  columns: [ColumnSchema], // Embedding columns
});

export default BoardSchema
