import { EmptyColumn } from '../components/TaskColumn/EmptyColumn';
import { TaskColumn } from '../components/TaskColumn/TaskColumn';
import { Navbar } from '../components/Navbar/Navbar';
import './taaskifyStyles.css';
import { useTheme } from '../Context/UseTheme';
import React, { useEffect, useRef, useState } from 'react';
import { AddNewBoard } from '../components/Containers/AddNewBoard';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '../Context/useUser';





export const TaaskifyApp = () => {
  const { user } = useUser();       // Get user data from UserContext
  const [activeBoardIndex, setActiveBoardIndex] = useState<number>(0);
  const [newColumn, setNewColumn] = useState<boolean>(false);
  const addNewBoardContainer = useRef<HTMLDivElement>(null);

  // useEffect to handle which board is currently active
  const handleBoardChange = (index: number) => {
    setActiveBoardIndex(index);
  };

  // constructing data for retrieval
  const boards = user?.user.boards || [];
  const userData = {
    firstName: user?.user.firstName || '',
    lastName: user?.user.lastName || '',
    emailAddress: user?.user.emailAddress || '',
  };

  const { theme } = useTheme();

  // changing the bg of the body element in the App
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === 'light' ? '#F4F7FD' : '#2B2C37';
  }, [theme]);

  // handles the bg color
  useEffect(() => {
    document.body.style.background = "rgb(0,14,36)";
    document.body.style.background = "linear-gradient(90deg, rgba(0,14,36,1) 4%, rgba(166,17,180,0.013064600840336116) 100%, rgba(0,212,255,1) 100%)";
  }, []);

  // theme to handle the new column container
  const handleBgTheme: React.CSSProperties = {
    background: theme === "dark" ? "linear-gradient(to bottom,rgba(43, 44, 55, 0.9) 0%,rgba(43, 44, 55, 0.5) 100%)" : "linear-gradient(to bottom,rgba(233, 239, 250, 1) 0%,rgba(233, 239, 250, 0.5) 100%)"
  }

  // handles the new column button
  const handlesNewColumn = () => {
    setNewColumn(true);
  }


  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newColumn && addNewBoardContainer.current && !addNewBoardContainer.current.contains(event.target as Node)) {
        setNewColumn(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newColumn])


  // animations for navbar container on mobile
  const getMenuAnimationOnMobile = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });



  return (
    <>
      <Navbar boards={boards} onBoardChange={handleBoardChange} user={userData} />
      <div
        className="taskColumnContainerWrap"
        data-testid="taskColumn"
      >
        {(boards.length > 0 &&
          boards[activeBoardIndex]?.columns.map((column: any, columnIndex: number) => (
            <TaskColumn
              key={`${activeBoardIndex}-${columnIndex}`}
              name={column?.name}
              tasks={column?.tasks}
            />
          ))) || <EmptyColumn />
        }
        {boards.length > 0 && (
          <div className="newColumnContainer rounded-lg cursor-pointer" style={handleBgTheme} onClick={handlesNewColumn}>
            <button className='font-bold'>+ New Column</button>
          </div>
        )}
      </div>

      {/* calling the add new board container for new columns to be created */}
      <AnimatePresence>
        {newColumn && (
          <motion.div
            className="containerOpenForBoard"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={addNewBoardContainer}
          >
            <AddNewBoard />
          </motion.div>
        )}
      </AnimatePresence>



      {newColumn && <div id="overLayEffect"></div>}
    </>
  );
};
