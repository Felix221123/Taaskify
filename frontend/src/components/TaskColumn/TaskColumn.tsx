import React, { useRef, useState, useEffect } from 'react';
import { ColumnProps } from '../Interface/Column';
import { generateRandomColor } from '../../utils/ColorGeneration';
import './taskColumnStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { ViewTaskContainer } from '../Containers/ViewTaskContainer';
import { countIncompleteSubtasks } from '../../utils/CountSubtask';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../Interface/AddTaskInterface';



export const TaskColumn: React.FC<ColumnProps> = ({ name, tasks }) => {
  const [isHoveredTask, setIsHoveredTask] = useState<number | null>(null);
  const [selectedViewTask, setSelectedViewTask] = useState<Task | null>(null);
  // const [isEditing, setIsEditing] = useState<boolean>(false);
  const viewTaskContainer = useRef<HTMLDivElement>(null);

  // using the theme from context
  const { theme } = useTheme();

  // hook to generate and set the circle color of a task column name
  const [backgroundColor] = useState(generateRandomColor());

  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedViewTask &&
        viewTaskContainer.current &&
        !viewTaskContainer.current.contains(event.target as Node)
      ) {
        setSelectedViewTask(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedViewTask]);

  // animations for the view container
  const getMenuAnimationVariantsForViewTask = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  useEffect(() => {
    console.log(selectedViewTask, 'is the value of viewTask now');
    console.log(isHoveredTask, ' is the valuse for hovered');
  }, [selectedViewTask, isHoveredTask]);

  // function to handle the hovering of a board
  const handleHoveredTask = (index: number) => {
    setIsHoveredTask(index);
    console.log(`Hovering task: ${index}`);
  };

  // function to handle un hovered boards
  const handleUnHoveredTask = () => {
    setIsHoveredTask(null);
    console.log(`Hovering task: set to false`);
  };

  // handles the onclick function of a task
  const handleOnClickTask = (task:Task) => {
    setSelectedViewTask(task);
    console.log(`Task clicked: ${task}`);
  };

  // styles to match the task board container when theme changes
  const handleBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // styles for the task board title when theme changes
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // an issue here
  // TODO: fix the on toggling of the edit container without
  // TODO: WAYS TO FIX THIS IS TO ENABLE CALL THE EDIT CONTAINER IN THE TASK COLUMN SECTION SO IT MATCHES THE VIEW TASK CONTAINER AND ITS DELETE CONTAINER
  // const handleEditToggle = (isEditing: boolean) => {
  //   setIsEditing(isEditing);
  //   if (isEditing) {
  //     setSelectedViewTask(null);
  //     // viewTaskContainer
  //   }
  // };

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
        {selectedViewTask && (
          <>
            <motion.div
              className="containerOpen"
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
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {selectedViewTask && <div id="overLayEffect"></div>}
    </>
  );
};
