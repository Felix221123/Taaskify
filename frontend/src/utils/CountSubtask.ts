import { Subtask } from "../components/Interface/AddTaskInterface";

export const countIncompleteSubtasks = (subtasks:Subtask[] , isCompleted:string) => {
    const totalSubtasks = subtasks.length;
    const incompleteSubtasks = subtasks.filter(subtask => !subtask.isCompleted).length;
    const completeSubtasks = subtasks.filter(subtask => subtask.isCompleted).length;
    // return `${incompleteSubtasks} of ${totalSubtasks} subtasks`;
    const text = isCompleted === "completed" ? `${completeSubtasks} of ${totalSubtasks} subtasks` : `${incompleteSubtasks} of ${totalSubtasks} subtasks`
    return text;
}

export const CountCompletedTasks = (subtasks:Subtask[]) => {
    const totalSubtasks = subtasks.length;
    const completedTask = subtasks.filter(subtask => subtask.isCompleted).length;
    return `Subtasks (${completedTask} of ${totalSubtasks})`;
}