import React, { useEffect, useRef, useState } from 'react';
import { IconCheck } from '../../Icons/IconCheck';
import { EditBtn } from '../Buttons/EditBtn';
import { useTheme } from '../../Context/UseTheme';
import {
  SubTaskEditTaskColumnContainerProps,
  Task,
} from '../Interface/AddTaskInterface';
import { TaskStatus } from './AddNewTaskContainer';
import './ContainersStyles.css';
import { EditDeleteContainer } from './EditDeleteContainer';
import { CountCompletedTasks } from '../../utils/CountSubtask';
import { EditTaskContainer } from './EditTaskContainer';
import { AnimatePresence } from 'framer-motion';
import { motion } from "framer-motion"




export const ViewTaskContainer: React.FC<Task> = ({
  title,
  description,
  status,
  subtasks
}) => {
  const [task, setTask] = useState<Task>({
    title,
    description,
    status,
    subtasks,
  });
  const [deleEditContainer, setDelEditContainer] = useState<boolean>(false);
  const [EditBtnContainer, setEditBtnContainer] = useState<boolean>(false);
  const editTaskContainer = useRef<HTMLDivElement>(null)

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

  // hook to handle edit task container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        EditBtnContainer &&
        editTaskContainer.current &&
        !editTaskContainer.current.contains(event.target as Node)
      ) {
        setEditBtnContainer(false);
        // onEditToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [EditBtnContainer]);

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // handle on open edit container
  const handleOnOpenEditContainer = () => {
    setEditBtnContainer(true);
    // onEditToggle(true);
  }

  // animations for the view container
  const getMenuAnimationVariantsForViewTask = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  return (
    <>
      <div
        className="ViewTaskContainer relative"
        style={{ ...backgroundContainerTheme }}
      >
        <div className="titleWithEditBtn">
          <article className="title font-bold" style={TitleColorOnChange}>
            {task.title}
          </article>
          <EditBtn onClickEditBtn={handleVisibilityForDelEditContainer} />
        </div>
        <div className="descriptionContainer leading-6 font-medium">
          {task.description}
        </div>
        <SubTaskForTaskContainer
          subtasks={task.subtasks}
          setSubtasks={(newSubtasks) =>
            setTask({ ...task, subtasks: newSubtasks })
          }
        />
        <TaskStatus
          taskContainerName="Current Status"
          status={task.status}
          setStatus={(newStatus) => setTask({ ...task, status: newStatus })}
        />
        <div className="editDeleteBtn">
          {deleEditContainer && <EditDeleteContainer containerName="task" onClickEditProp={() => handleOnOpenEditContainer()} />}
        </div>
      </div>

      {/* container to handle on edit task */}
      <AnimatePresence>
        {EditBtnContainer && (
          <>
            <motion.div
              className="containerOpen"
              initial={getMenuAnimationVariantsForViewTask().hidden}
              animate={getMenuAnimationVariantsForViewTask().visible}
              exit={getMenuAnimationVariantsForViewTask().exit}
              data-testid="editTaskContainer"
              transition={{ duration: 0.5 }}
              ref={editTaskContainer}
            >
              <EditTaskContainer
                title={task.title}
                description={task.description}
                subtasks={task.subtasks}
                status={task.status}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {EditBtnContainer && (<div id='overlayEffect'></div>)}
    </>
  );
};





// sub task container for the task Container
export const SubTaskForTaskContainer = ({
  subtasks,
  setSubtasks,
}: SubTaskEditTaskColumnContainerProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [checkedIndices, setCheckedIndices] = useState<boolean[]>(
    subtasks.map((subtask) => subtask.isCompleted)
  );

  // handles the toggle checked on each task
  const handleCheckToggle = (index: number) => {
    const updatedCheckedIndices = [...checkedIndices];
    updatedCheckedIndices[index] = !updatedCheckedIndices[index];
    setCheckedIndices(updatedCheckedIndices);
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].isCompleted = !updatedSubtasks[index].isCompleted;
    setSubtasks(updatedSubtasks);
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
                  onToggle={() => handleCheckToggle(index)}
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
