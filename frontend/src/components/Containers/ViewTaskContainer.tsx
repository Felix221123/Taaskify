import React, { useState } from 'react';
import { IconCheck } from '../../Icons/IconCheck';
import { EditBtn } from '../Buttons/EditBtn';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../Context/Theme/UseTheme';
import {
  SubTaskEditTaskColumnContainerProps,
  Task,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { EditDeleteContainer } from './EditDeleteContainer';
import { CountCompletedTasks } from '../../utils/CountSubtask';
import { TaskStatusDropdown } from './TaskStatusContainer';
import { useUser } from '../../Context/User/useUser';
import UpdateSubtaskStatusApi from '../../packages/Api/BoardApi/UpdateSubtaskStatusApi';


interface OnClickEditDeleteProps {
  ontoggleEdit: () => void;
  ontoggleDelete: () => void;
}

interface ViewTaskContainerProps extends Task, OnClickEditDeleteProps {
  columns: { id: string; name: string; tasks:Array<any> }[];
  boardID: string;
  columnID: string;
  taskID: string;
}


interface ViewTaskFormData {
  taskTitle: string;
  description: string;
  status: string;
  subtasks: Array<{ title: string; isCompleted: boolean }>;
}


export const ViewTaskContainer: React.FC<ViewTaskContainerProps> = ({
  title,
  description,
  status,
  columns,
  subtasks,
  ontoggleEdit,
  ontoggleDelete,
  boardID,
  columnID,
  taskID,
}) => {
  // Initialize form with react-hook-form
  const { control, setValue } = useForm<ViewTaskFormData>({
    defaultValues: {
      taskTitle: title,
      description: description,
      status: status,
      subtasks: subtasks,
    },
  });

  const [deleEditContainer, setDelEditContainer] = useState<boolean>(false);

  // handles the visibility of the edit/ delete container
  const handleVisibilityForDelEditContainer = () => {
    setDelEditContainer((previous) => !previous);
  };

  // using the useTheme provider to set colors
  const { theme } = useTheme();

  // background theme colors
  const backgroundContainerTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  return (
    <>
      <div
        className="ViewTaskContainer relative"
        style={{ ...backgroundContainerTheme }}
      >
        <div className="titleWithEditBtn">
          <article className="title font-bold" style={TitleColorOnChange}>
            { title }
          </article>
          <EditBtn onClickEditBtn={handleVisibilityForDelEditContainer} />
        </div>
        <div className="descriptionContainer leading-6 font-medium">
          { description }
        </div>
        {/* subtask container */}
        <SubTaskForTaskContainer
          subtasks={subtasks}
          setSubtasks={(newSubtasks) => setValue('subtasks', newSubtasks)}
          boardID={boardID}
          columnID={columnID}
          taskID={taskID}
        />

        {/* Task status for handling the status of the task */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <TaskStatusDropdown
              status={field.value}
              setStatus={(newStatus) => field.onChange(newStatus)}
              columns={columns}
              containerName="Current Status"
            />
          )}
        />
        {/* button for edit / delete task container */}
        <div className="editDeleteBtn">
          {deleEditContainer && <EditDeleteContainer containerName="task" onClickEditProp={ontoggleEdit} onClickDeleteProp={ontoggleDelete} />}
        </div>
      </div>
    </>
  );
};




interface ViewTaskSubTaskInterfaceProps extends SubTaskEditTaskColumnContainerProps {
  boardID: string;
  columnID: string;
  taskID: string;
}



// sub task container for the task Container
export const SubTaskForTaskContainer = ({
  subtasks,
  setSubtasks,
  boardID,
  columnID,
  taskID,
}: ViewTaskSubTaskInterfaceProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [checkedIndices, setCheckedIndices] = useState<boolean[]>(
    subtasks.map((subtask) => subtask.isCompleted)
  );

  // pulling the user's info
  const { user } = useUser();

  // handles the toggle checked on each task
  const handleCheckToggle = async (index: number, isChecked: boolean) => {
    try {
      const updatedCheckedIndices = [...checkedIndices];
      updatedCheckedIndices[index] = isChecked;
      setCheckedIndices(updatedCheckedIndices);

      const updatedSubtasks = [...subtasks];
      updatedSubtasks[index].isCompleted = isChecked;
      setSubtasks(updatedSubtasks);

      // getting the users ID
      const userID = user?.user._id;

      console.log(updatedCheckedIndices);


      // console.log(userID,
      //   boardID,
      //   columnID,
      //   taskID,
      //   updatedSubtasks[index]._id,'is the subtask id',
      // isChecked, ' is the responses for the update subtask checking');


      // Call the API to update the subtask status
      await UpdateSubtaskStatusApi({
        userID,
        boardID,
        columnID,
        taskID,
        subtaskID: updatedSubtasks[index]?._id,
        isCompleted: isChecked,
      });


    } catch (error) {
      console.error('Failed to update subtask status:', error);
      // Optionally, revert the change in case of error
      const revertedCheckedIndices = [...checkedIndices];
      revertedCheckedIndices[index] = !isChecked;
      setCheckedIndices(revertedCheckedIndices);

      const revertedSubtasks = [...subtasks];
      revertedSubtasks[index].isCompleted = !isChecked;
      setSubtasks(revertedSubtasks);
    }
  };


  // sets the hovered task
  const handleMouseOver = (index: number) => {
    setHoveredIndex(index);
  };

  // sets the unHovered task
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const { theme } = useTheme();
  // input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // backgroundColor for each theme
  const bgThemeForSubTask: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#F4F7FD' : '#20212C',
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // styles for hovering
  const combinedStyle: React.CSSProperties = hoveredIndex
    ? {
      backgroundColor: '#A8A4FF',
    }
    : { backgroundColor: theme === 'light' ? '#FFFFFF' : '#2B2C37' };

  // styles for checked task
  const handleCheckedStyles: React.CSSProperties = {
    textDecoration: 'line-through',
    color: '#828FA3',
  };

  return (
    <>
      <div className="subTaskContainer">
        <article className="font-bold" style={TextColorOnChange}>
          {CountCompletedTasks(subtasks)}
        </article>
        <div className="listOfTask">
          <div className="scrollableContainer" data-testid="subtaskContainer">
            {subtasks.map((subTask, index) => (
              <div
                className="subTaskContainer cursor-pointer"
                key={index}
                style={{
                  ...bgThemeForSubTask,
                  ...combinedStyle,
                  backgroundColor:
                    hoveredIndex === index
                      ? 'rgba(99, 95, 199, 0.25)'
                      : bgThemeForSubTask.backgroundColor,
                }}
                onMouseOver={() => handleMouseOver(index)}
                onMouseLeave={handleMouseLeave}
              >
                <IconCheck
                  index={index}
                  isCompleted={subTask.isCompleted}
                  onToggle={(isChecked) => handleCheckToggle(index, isChecked)}
                />
                <p
                  className="titleText font-bold text-left"
                  style={{
                    ...TitleColorOnChange,
                    ...(checkedIndices[index] ? handleCheckedStyles : {}),
                  }}
                >
                  {subTask.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
