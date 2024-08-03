import { useEffect, useState, forwardRef } from 'react';
import {
  EditDeleteContainerProps,
  onClickPropsForEdit,
  onClickPropsForDelete,
} from '../Interface/AddTaskInterface';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { motion, AnimatePresence } from 'framer-motion';

export const EditDeleteContainer = forwardRef<
  HTMLDivElement,
  onClickPropsForEdit & onClickPropsForDelete & EditDeleteContainerProps
>(({ onClickEditProp, onClickDeleteProp, containerName }, ref) => {
  // state to manage the name of the container
  const [container, setContainer] = useState<string>('');

  // useEffect hook to handle setting the name of the container
  useEffect(() => {
    const handleSetContainerName = (title: string) => {
      return title.toLowerCase() === 'task'
        ? setContainer('Task')
        : title.toLowerCase() === 'board'
          ? setContainer('Board')
          : 'Error';
    };
    handleSetContainerName(containerName);
  }, [containerName]);

  const { theme } = useTheme();

  // background theme colors
  const boardContainerTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#2B2C37',
  };

  // animation for container
  const getMenuAnimationVariants = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="editDeleteContainer"
          style={boardContainerTheme}
          initial={getMenuAnimationVariants().hidden}
          animate={getMenuAnimationVariants().visible}
          exit={getMenuAnimationVariants().exit}
          transition={{ duration: 0.5 }}
          data-testid="editDeleteCon"
          ref={ref}
        >
          <button
            className="editText font-medium leading-6 cursor-pointer"
            onClick={onClickEditProp}
            data-testid="btn1"
          >
            Edit {container}
          </button>
          <button
            className="deleteText font-medium leading-6 cursor-pointer"
            onClick={onClickDeleteProp}
            data-testid="btn2"
          >
            Delete {container}
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
});
