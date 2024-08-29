import { useTheme } from '../../Context/UseTheme';
import React, { useState } from 'react';
import {
  onCloseContainerProp,
  SubTaskEditTaskColumnContainerProps,
  TaskStatusContainerName,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';
import { CrossIcon } from '../../Icons/Cross';
import { ChevronIconDown } from '../../Icons/ChevronIconDown';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { CloseIcon } from '../../Icons/CloseIcon';
import { useForm, Controller } from 'react-hook-form';
import CreateTaskApi from '../../packages/Api/BoardApi/CreateTaskApi';
import { SubTaskInputContainer } from './SubTaskColumnContainer';
import { TaskStatusDropdown } from './TaskStatusContainer';
import { useUser } from '../../Context/useUser';
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
      // Reset the form after successful submission

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





// sub component used to get the subtask from the user for the main component
export const SubTaskAddNewTaskColumnContainer: React.FC<
  SubTaskEditTaskColumnContainerProps
> = ({ subtasks, setSubtasks }) => {
  // const to keep track of the columns available

  const { theme } = useTheme();
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  const addNewColumn = () => {
    setSubtasks([...subtasks, { title: '', isCompleted: false }]);
    // console.log("Add new column clicked. Current columns:", subtask);
  };

  const handleColumnChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };

  const removeColumn = (index: number) => {
    if (index < 2) return; // Prevent deletion of the first two columns
    const newColumns = subtasks.filter((_, i) => i !== index);
    setSubtasks(newColumns);
  };

  return (
    <>
      <div className="boardColumnsContainer">
        <p className="boardColumnsText font-bold" style={TextColorOnChange}>
          Subtasks
        </p>
        {/* TODO:CREATE A EDIT FOR THE COLUMNS BOARD */}
        <div className="containerForColumn">
          {/* creating first two subtask */}
          {/* first one here */}
          <div className="scrollableContainer">
            {subtasks.map((column, index) => (
              <div className="eachColumnContainer" key={index}>
                <label htmlFor={`eachColumnBoard-${index}`}>
                  <input
                    type="text"
                    id={`eachColumnBoard-${index}`}
                    value={column.title}
                    style={TitleColorOnChange}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    placeholder={
                      index === 0
                        ? 'e.g. Make coffee'
                        : index === 1
                          ? 'e.g. Drink coffee & smile'
                          : 'e.g. Sample Text'
                    }
                  />
                </label>
                <CrossIcon onClick={() => removeColumn(index)} />
              </div>
            ))}
          </div>
        </div>

        <SecondaryBtn buttonName="+ Add New Column" onClickProp={addNewColumn} />
      </div>
    </>
  );
};





// sub component for choosing the status of the a task
export const TaskStatus = ({
  taskContainerName,
  status,
  setStatus,
}: TaskStatusContainerName) => {
  const [statuses] = useState<string[]>(['Todo', 'Doing', 'Done']);
  const { theme } = useTheme();
  // input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };
  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div className="card">
      <label
        htmlFor="taskStatus"
        className="font-bold"
        style={TextColorOnChange}
      >
        {taskContainerName}
        <div className="select-container cursor-pointer">
          <select
            value={status}
            onChange={handleStatusChange}
            style={TitleColorOnChange}
            className="dropdownContainer w-full h-10"
          >
            <option value="" disabled>
              Select Status
            </option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronIconDown className="chevron-icon" />
        </div>
      </label>
    </div>
  );
};
