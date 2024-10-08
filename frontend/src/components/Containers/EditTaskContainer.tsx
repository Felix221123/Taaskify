import { useTheme } from '../../Context/Theme/UseTheme';
import React from 'react';
import {
  onCloseContainerProp,
  Task,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { CloseIcon } from '../../Icons/CloseIcon';
import { useForm, Controller } from 'react-hook-form';
import { useUser } from '../../Context/User/useUser';
import { TaskStatusDropdown } from './TaskStatusContainer';
import { SubTaskInputContainer } from './SubTaskColumnContainer';
import EditTaskApi from '../../packages/Api/BoardApi/EditTaskApi';
import { openCustomNotification } from '../../utils/notificationUtil';
import { NotificationContainerStyle } from '../../utils/NotificationContainerStyle';
import { SuccessIcon } from '../../Icons/SuccessIcon';
import { ErrorIcon } from '../../Icons/ErrorIcon';



interface EditTaskFormData {
  taskTitle: string;
  description: string;
  subtasks: Array<{ title: string; isCompleted: boolean }>;
  status: string;
}

interface ColumnOption {
  id: string;
  name: string;
}

interface EditTaskContainerProps extends onCloseContainerProp {
  task: Task;
  columns: ColumnOption[];
  boardID: string;
  taskID: string;
}




export const EditTaskContainer: React.FC<EditTaskContainerProps> = ({
  onCloseProp, task, columns, boardID, taskID
}) => {
  const { control, handleSubmit, register, reset, } = useForm<EditTaskFormData>({
    defaultValues: {
      taskTitle: task.title,
      description: task.description,
      subtasks: task.subtasks,
      status: task.status,
    },
  });

  // calling context values
  const { theme } = useTheme();
  const { user } = useUser();

  // background theme colors
  const boardContainerTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };


  // Handle form submission
  const onSubmit = async (data: EditTaskFormData) => {
    try {
      const userID = user?.user._id;

      const taskData = {
        userID,
        boardID,
        columnID: data.status,
        taskID,
        taskTitle: data.taskTitle,
        description: data.description,
        status: data.status,
        subtasks: data.subtasks,
      };

      const response = await EditTaskApi(taskData);

      if (response) {
        reset();
        onCloseProp();
        openCustomNotification(
          <>
            <NotificationContainerStyle message='Task Updated'>
              <SuccessIcon />
            </NotificationContainerStyle>
          </>,
          <>Your Task has been successfully updated.</>
        );
      }
    } catch (error) {
      console.error('Error editing task:', error);
      openCustomNotification(
        <NotificationContainerStyle message='Error'>
          <ErrorIcon />
        </NotificationContainerStyle>,
        <>Failed to update the Task. Please ensure there is a "Title" and at least one "Subtask".</>
      );
      onCloseProp();
    }
  };


  return (
    <>
      <div className="addTaskContainer" style={boardContainerTheme}>
        <div className="headerBtnContainer flex flex-row items-center justify-between">
          <article className="editBoardText font-bold" style={TitleColorOnChange}>
            Edit Task
          </article>
          <div onClick={onCloseProp} data-testid="closeBtn">
            <CloseIcon />
          </div>
        </div>

        {/* form submission area */}
        <form action="" onSubmit={handleSubmit(onSubmit)} method='patch'>
          <div className="boardNameContainer">
            <label
              htmlFor="title"
              className="font-bold"
              style={TextColorOnChange}
            >
              Title
              <input
                type="text"
                id="title"
                {...register('taskTitle', { required: true })}
                className="font-medium leading-6"
                style={TitleColorOnChange}
                placeholder="e.g. Take coffee break"
              />
            </label>
          </div>
          {/* describe the task container */}
          <div className="boardNameContainer">
            <label
              htmlFor="description"
              className="font-bold"
              style={TextColorOnChange}
            >
              Description
              <textarea
                id="description"
                {...register('description')}
                className="descriptionContainer font-medium leading-6"
                style={TitleColorOnChange}
                placeholder="e.g.It’s always good to take a break. This
15 minute break will  recharge the batteries
a little."
              ></textarea>
            </label>
          </div>
          {/* controller for sub task container */}
          <Controller
            control={control}
            name="subtasks"
            render={({ field }) => (
              <SubTaskInputContainer control={control} name={field.name} />
            )}
          />

          {/* controller for choosing the task status */}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <TaskStatusDropdown
                status={field.value}
                setStatus={(newStatus) => field.onChange(newStatus)}
                columns={columns}
                containerName="Status"
              />
            )}
          />

          {/* primary button for submission */}
          <PrimaryBtnSmall buttonName="Save Changes" btnType='submit' />
        </form>
      </div>
    </>
  );
};
