import React, { useEffect, useRef, useState } from 'react';
import { AddNewColumnBtn } from '../Buttons/AddNewColumnBtn';
import './taskColumnStyles.css';
import { AnimatePresence, motion } from 'framer-motion';
import { AddNewBoard } from '../Containers/AddNewBoard';


interface emptyColumnProp {
  container: string
}


export const EmptyColumn: React.FC<emptyColumnProp> = ({ container }) => {
  const [newColumnContainer, setNewColumnContainer] = useState<boolean>(false);
  const addNewBoardContainer = useRef<HTMLDivElement>(null);


  // function to handle the creation of columns
  const handleNewColumn = () => {
    setNewColumnContainer(true);
  }

  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newColumnContainer && addNewBoardContainer.current && !addNewBoardContainer.current.contains(event.target as Node)) {
        setNewColumnContainer(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newColumnContainer])


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
            <AddNewColumnBtn buttonName="+ Add New Board" onClickProp={handleNewColumn} />
          </div>
        )}


      {/* replace this with the edit board container */}
      {/* TODO:replace this with the edit board container */}
      <AnimatePresence>
        {
          newColumnContainer && (
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
      {newColumnContainer && (<div id="overLayEffect"></div>)}
    </>
  );
};
