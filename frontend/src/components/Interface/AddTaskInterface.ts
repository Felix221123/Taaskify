export interface Subtask {
  title: string;
  isCompleted: boolean;
  _id?:string
}




export interface SubtaskPropWithID {
  title: string;
  isCompleted: boolean;
  _id:string;
}

export interface Task {
  title: string | undefined;
  description: string | undefined;
  status: string | undefined;
  subtasks: Subtask[];
}


export interface TaskProps{
  title: string | undefined;
  description: string | undefined;
  status: string | undefined;
  subtasks: Subtask[];
  _id:string;
}


export interface onClickPropsEditBtnProps {
  onClickEditBtn?: () => void;
  className?: string;
}

export interface onClickPropsForEdit {
  onClickEditProp?: () => void;
}
export interface onClickPropsForDelete {
  onClickDeleteProp?: () => void;
}

export interface EditDeleteContainerProps {
  containerName: string;
}

export interface iconCheckProps {
  index: number;
  onToggle: (isCompleted: boolean) => void;
  isCompleted:boolean;
}

export interface TaskStatusContainerName {
  taskContainerName: string;
  status: string;
  setStatus: (status: string) => void;
}

export interface SubTaskEditTaskColumnContainerProps {
  subtasks: Subtask[];
  setSubtasks: (subtask: Subtask[]) => void;
}


export interface onCloseContainerProp{
  onCloseProp:() => void;
}
