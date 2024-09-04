import React, { useEffect, useRef, useState } from 'react';
import { AddNewColumnBtn } from '../Buttons/AddNewColumnBtn';
import './taskColumnStyles.css';
import { AnimatePresence, motion } from 'framer-motion';
import { AddNewBoard } from '../Containers/AddNewBoard';


interface emptyColumnProp {
  container: string
  onEditBoardTrigger: () => void;
}


export const EmptyColumn: React.FC<emptyColumnProp> = ({ container,onEditBoardTrigger }) => {
  const [newBoardContainer, setNewBoardContainer] = useState<boolean>(false);
  const addNewBoardContainer = useRef<HTMLDivElement>(null);


  // function to handle the creation of columns
  const handleNewBoard = () => {
    setNewBoardContainer(true);
  }

  const handleNewColumn = () => {
    onEditBoardTrigger(); // Trigger the prop passed from the parent component
  };

  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newBoardContainer && addNewBoardContainer.current && !addNewBoardContainer.current.contains(event.target as Node)) {
        setNewBoardContainer(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newBoardContainer])


  // animations for navbar container on mobile
  const getMenuAnimationOnMobile = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  return (
    <>

      {
        container === "column" && (
          <div className="emptyBoardContainer">
            <p className="text font-bold text-center" data-testid="emptyText">
              This board is empty. Create a new column to get started.
            </p>
            <AddNewColumnBtn buttonName="+ Add New Column" onClickProp={handleNewColumn} />
          </div>
        )}

      {
        container === "boards" && (
          <div className="emptyBoardContainer">
            <p className="text font-bold text-center" data-testid="emptyText">
              Your Taaskify account has no boards, create a board.
            </p>
            <AddNewColumnBtn buttonName="+ Add New Board" onClickProp={handleNewBoard} />
          </div>
        )}


      {/* calling the add new board container when there is no board in the application*/}
      <AnimatePresence>
        {
          newBoardContainer && (
            <motion.div
              className="containerOpenForBoard"
              initial={getMenuAnimationOnMobile().hidden}
              animate={getMenuAnimationOnMobile().visible}
              exit={getMenuAnimationOnMobile().exit}
              transition={{ duration: 0.5 }}
              ref={addNewBoardContainer}
            >
              <AddNewBoard onCloseContainer={() => { }} />
            </motion.div>
          )}
      </AnimatePresence>

      {/* condition of overlay effect */}
      {newBoardContainer && (<div id="overLayEffect"></div>)}
    </>
  );
};
