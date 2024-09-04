import { useTheme } from '../../Context/Theme/UseTheme';
import React from 'react';
import {
  onCloseContainerProp,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { CloseIcon } from '../../Icons/CloseIcon';
import { useForm, Controller } from 'react-hook-form';
import CreateTaskApi from '../../packages/Api/BoardApi/CreateTaskApi';
import { SubTaskInputContainer } from './SubTaskColumnContainer';
import { TaskStatusDropdown } from './TaskStatusContainer';
import { useUser } from '../../Context/User/useUser';
import { openCustomNotification } from '../../utils/notificationUtil';
import { NotificationContainerStyle } from '../../utils/NotificationContainerStyle';
import { SuccessIcon } from '../../Icons/SuccessIcon';
import { ErrorIcon } from '../../Icons/ErrorIcon';



interface CreateTaskFormData {
  taskTitle: string;
  description: string;
  subtasks: Array<{ title: string }>;
  status: string;
}


interface ColumnOption {
  id: string;
  name: string;
}


interface AddNewTaskContainerProps extends onCloseContainerProp {
  columns: ColumnOption[]; // New prop for columns
  boardID: string;
}



export const AddNewTaskContainer: React.FC<AddNewTaskContainerProps> = ({ onCloseProp, columns, boardID }) => {
  const { control, handleSubmit, register, reset, getValues, setValue } = useForm<CreateTaskFormData>({
    defaultValues: {
      taskTitle: '',
      description: '',
      subtasks: [{ title: '' }, { title: '' }],
      status: ''
    },
  });

  // useTheme and useUser context
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
  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      const userID = user?.user._id; // Replace with actual user ID
      const columnID = data.status

      const taskData = {
        userID,
        boardID,
        columnID,
        taskTitle: data.taskTitle,
        description: data.description,
        subtasks: data.subtasks,
      };

      const response = await CreateTaskApi(taskData);

      // after a successful data submission
      if (response) {
        reset();   // reset forms after submission
        onCloseProp();       //close container after a successful submission
        console.log(`task has been created successfully ${taskData}`);
        openCustomNotification(
          <>
          <NotificationContainerStyle message='Task Created'>
            <SuccessIcon />
          </NotificationContainerStyle>
          </>,
          <>
          Your new Task has been successfully created.
          </>
        )
      }

    } catch (error) {
      console.error('Error creating task:', error);
      openCustomNotification(
        <NotificationContainerStyle message='Error'>
          <ErrorIcon />
        </NotificationContainerStyle>,
        <>Failed to create the Task. Please ensure there is a "Title" and at least one "Subtask".</>
      );
      onCloseProp();
    }
  };





  return (
    <>
      <div className="addTaskContainer" style={boardContainerTheme}>
        <div className="headerBtnContainer flex flex-row items-center justify-between">
          <article className="editBoardText font-bold" style={TitleColorOnChange}>
            Add New Task
          </article>
          <div onClick={onCloseProp} data-testid="closeBtn">
            <CloseIcon />
          </div>
        </div>

        {/* form submission area */}
        <form action="" onSubmit={handleSubmit(onSubmit)}>
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
          <TaskStatusDropdown
            status={getValues('status')}
            setStatus={(newStatus) => setValue('status', newStatus)}
            columns={columns}
            containerName='Status'
          />

          {/* submission button */}
          <PrimaryBtnSmall buttonName="Create Task" btnType="submit" />
        </form>
      </div>
    </>
  );
};
