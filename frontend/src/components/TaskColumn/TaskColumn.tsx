import React, { useRef, useState, useEffect } from 'react';
import { ColumnProps } from '../Interface/Column';
import { generateRandomColor } from '../../utils/ColorGeneration';
import './taskColumnStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { ViewTaskContainer } from '../Containers/ViewTaskContainer';
import { countIncompleteSubtasks } from '../../utils/CountSubtask';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../Interface/AddTaskInterface';
import { EditTaskContainer } from '../Containers/EditTaskContainer';
import { DeleteContainer } from '../Containers/DeleteContainer';



export const TaskColumn: React.FC<ColumnProps> = ({ name, tasks }) => {
  const [isHoveredTask, setIsHoveredTask] = useState<number | null>(null);
  const [selectedViewTask, setSelectedViewTask] = useState<Task | null>(null);
  const [viewTaskVisibiity, setViewTaskVisibiity] = useState<boolean>(false)
  const [editTaskBtnContainer, setEditTaskBtnContainer] = useState<boolean>(false);
  const [deleteTaskBtnContainer, setDeleteTaskBtnContainer] = useState<boolean>(false);
  const viewTaskContainer = useRef<HTMLDivElement>(null);
  const editTaskContainer = useRef<HTMLDivElement>(null);
  const deleteContainer = useRef<HTMLDivElement>(null);


  // using the theme from context
  const { theme } = useTheme();

  // hook to generate and set the circle color of a task column name
  const [backgroundColor] = useState(generateRandomColor());

  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewTaskVisibiity && viewTaskContainer.current && !viewTaskContainer.current.contains(event.target as Node)) {
        setSelectedViewTask(null);
      } else if (editTaskBtnContainer && editTaskContainer.current && !editTaskContainer.current.contains(event.target as Node)) {
        setEditTaskBtnContainer(false)
      } else if (deleteTaskBtnContainer && deleteContainer.current && !deleteContainer.current.contains(event.target as Node)) {
        setDeleteTaskBtnContainer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewTaskVisibiity, editTaskBtnContainer, deleteTaskBtnContainer]);

  // animations for the view container
  const getMenuAnimationVariantsForViewTask = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  // function to handle the hovering of a board
  const handleHoveredTask = (index: number) => {
    setIsHoveredTask(index);
  };

  // function to handle un hovered boards
  const handleUnHoveredTask = () => {
    setIsHoveredTask(null);
  };

  // function to handle the closing of the edit task container
  const handleOnCloseEditTaskContainer = () => {
    setEditTaskBtnContainer(false);
  }

  // handles the onclick function of a task
  const handleOnClickTask = (task: Task) => {
    setViewTaskVisibiity(true)
    setSelectedViewTask(task);
  };

  // styles to match the task board container when theme changes
  const handleBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // styles for the task board title when theme changes
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // function to handle the edit and delete task components
  const handleEditDeleteTaskBtn = (prop: string) => {
    if (prop === "edit") {
      setEditTaskBtnContainer(true);
      setViewTaskVisibiity(false);

    } else if (prop === "delete") {
      setDeleteTaskBtnContainer(true);
      setViewTaskVisibiity(false);
    }
  };

  const handleOnCancel = () => {
    setDeleteTaskBtnContainer(false);
  }


  return (
    <>
      <div className="taskColumnContainer">
        <div className="taskColumnNameCount font-bold">
          <div
            className="colorCircle"
            style={{ background: backgroundColor }}
            data-testid="colorCircle"
          >
          </div>
          <p className="taskColumnName uppercase" data-testid="taskName">
            {name}
          </p>
          <p className="taskCount" data-testid="taskCount">
            ({tasks?.length})
          </p>
        </div>
        <div className="mainTaskContainer">
          {tasks.map((task, index) => (
            <div
              className="columnTaskContainer cursor-pointer"
              key={index}
              style={handleBgTheme}
              onMouseEnter={() => handleHoveredTask(index)}
              onMouseLeave={() => handleUnHoveredTask()}
              onClick={() => handleOnClickTask(task)}
            >
              <article
                className="taskTitle cursor-pointer font-bold"
                data-testid="taskTitle"
                style={{
                  ...TitleColorOnChange,
                  color:
                    isHoveredTask === index
                      ? '#635FC7'
                      : TitleColorOnChange.color,
                }}
              >
                {task.title}
              </article>
              <div
                className="subtaskCount font-bold"
                data-testid="subTaskCount"
              >
                {countIncompleteSubtasks(task.subtasks, 'completed')}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* container to view task when they are pressed */}
      <AnimatePresence>
        {selectedViewTask && viewTaskVisibiity && (
          <>
            <motion.div
              className="containerOpenForViewTask"
              initial={getMenuAnimationVariantsForViewTask().hidden}
              animate={getMenuAnimationVariantsForViewTask().visible}
              exit={getMenuAnimationVariantsForViewTask().exit}
              data-testid="viewTaskContainer"
              transition={{ duration: 0.5 }}
              ref={viewTaskContainer}
            >
              <ViewTaskContainer
                title={selectedViewTask.title}
                description={selectedViewTask.description}
                status={selectedViewTask.status}
                subtasks={selectedViewTask.subtasks}
                ontoggleEdit={() => handleEditDeleteTaskBtn("edit")}
                ontoggleDelete={() => handleEditDeleteTaskBtn("delete")}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* container to handle on edit task */}
      <AnimatePresence>
        {editTaskBtnContainer && selectedViewTask && (
          <>
            <motion.div
              className="containerOpenForEditTask"
              initial={getMenuAnimationVariantsForViewTask().hidden}
              animate={getMenuAnimationVariantsForViewTask().visible}
              exit={getMenuAnimationVariantsForViewTask().exit}
              data-testid="editTaskContainer"
              transition={{ duration: 0.5 }}
              ref={editTaskContainer}
            >
              <EditTaskContainer
                title={selectedViewTask?.title}
                description={selectedViewTask?.description}
                subtasks={selectedViewTask?.subtasks ?? []}
                status={selectedViewTask?.status}
                onCloseProp={handleOnCloseEditTaskContainer}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* container to handle on delete task */}
      <AnimatePresence>
        {deleteTaskBtnContainer && selectedViewTask && (
          <>
            <motion.div
              className="containerOpenForEditDeleteTask"
              initial={getMenuAnimationVariantsForViewTask().hidden}
              animate={getMenuAnimationVariantsForViewTask().visible}
              exit={getMenuAnimationVariantsForViewTask().exit}
              data-testid="deleteTaskContainer"
              transition={{ duration: 0.5 }}
              ref={deleteContainer}
            >
              <DeleteContainer
                deleteContainerName='task'
                deleteContainerItemName={selectedViewTask?.title}
                setEditDelBoardCon={handleOnCancel} />
            </motion.div>
          </>
        )}

      </AnimatePresence>


      {/* condition of overlay effect */}
      {selectedViewTask && editTaskBtnContainer && (<div id="overLayEffect"></div>)}
      {selectedViewTask && viewTaskVisibiity && (<div id="overLayEffect"></div>)}
      {selectedViewTask && deleteTaskBtnContainer && (<div id="overLayEffect"></div>)}
    </>
  );
};
