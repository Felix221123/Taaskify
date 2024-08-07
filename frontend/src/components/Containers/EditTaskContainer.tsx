import { useTheme } from '../../Context/UseTheme';
import React, { useState } from 'react';
import {
  SubTaskEditTaskColumnContainerProps,
  Task,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';
import { CrossIcon } from '../../Icons/Cross';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { TaskStatus } from './AddNewTaskContainer';

export const EditTaskContainer: React.FC<Task> = ({
  title,
  description,
  status,
  subtasks,
}) => {
  const [task, setTask] = useState<Task>({
    title,
    description,
    status,
    subtasks,
  });

  // handling the onchange of the input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTask({
      ...task,
      [id]: value,
    });
    console.log(task.title);
    console.log(task.description);
  };
  const { theme } = useTheme();

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

  return (
    <>
      <div className="addTaskContainer" style={boardContainerTheme}>
        <article className="editBoardText font-bold" style={TitleColorOnChange}>
          Edit Task
        </article>
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
              value={task.title}
              onChange={handleInputChange}
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
              value={task.description}
              onChange={handleInputChange}
              className="descriptionContainer font-medium leading-6"
              style={TitleColorOnChange}
              placeholder="e.g.It’s always good to take a break. This
15 minute break will  recharge the batteries
a little."
            ></textarea>
          </label>
        </div>
        <SubTaskEditTaskColumnContainer
          subtasks={task.subtasks}
          setSubtasks={(newSubtasks) =>
            setTask({ ...task, subtasks: newSubtasks })
          }
        />
        <TaskStatus
          taskContainerName="Status"
          status={task.status ?? ""}
          setStatus={(newStatus) => setTask({ ...task, status: newStatus })}
        />
        <PrimaryBtnSmall buttonName="Save Changes" />
      </div>
    </>
  );
};

// sub component used to get the subtask from the user for the main component
export const SubTaskEditTaskColumnContainer: React.FC<
  SubTaskEditTaskColumnContainerProps
> = ({ subtasks, setSubtasks }) => {
  // const to keep track of the columns available
  // Initialize with the first two subtasks
  const { theme } = useTheme();
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  const addNewColumn = () => {
    setSubtasks([...subtasks, { title: '', isCompleted: false }]);
    console.log('Add new column clicked. Current columns:', subtasks);
  };

  const handleColumnChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = value;
    setSubtasks(newSubtasks);
  };

  const removeColumn = (index: number) => {
    if (index < 2) return; // Prevent deletion of the first two columns
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
  };

  return (
    <>
      <div className="boardColumnsContainer">
        <p className="boardColumnsText font-bold" style={TextColorOnChange}>
          Board Columns
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

        <SecondaryBtn buttonName="+ Add New Column" onClick={addNewColumn} />
      </div>
    </>
  );
};
