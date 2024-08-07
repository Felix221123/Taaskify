import React, { useEffect, useState } from 'react';
import { DeleteContainerProps } from '../Interface/DeleteContainerInterface';
import { DestructiveBtn } from '../Buttons/DestructiveBtn';
import { CancelBtn } from '../Buttons/CancelBtn';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';

interface DeleteContainerPropsWithSetter extends DeleteContainerProps {
  setEditDelBoardCon: React.Dispatch<React.SetStateAction<string>>;
}

export const DeleteContainer = ({
  deleteContainerName,
  deleteContainerItemName,
  setEditDelBoardCon,
}: DeleteContainerPropsWithSetter) => {
  // const states to check which container is right to use
  const [deleteContainerTitle, setDeleteContainerTitle] = useState<string>('');
  const [deleteContainerText, setDeleteContainerText] = useState<string>('');

  // this useEffect used to set the correct title of the container
  useEffect(() => {
    try {
      const handleSetDeleteContainer = (title: string) => {
        if (title.toLowerCase() === 'board') {
          setDeleteContainerTitle('board');
          setDeleteContainerText(
            `Are you sure you want to delete the '${deleteContainerItemName}' board? This action will remove all columns and tasks and cannot be reversed.`
          );
        } else if (title.toLowerCase() === 'task') {
          setDeleteContainerTitle('task');
          setDeleteContainerText(
            `Are you sure you want to delete the '${deleteContainerItemName}' task and its subtasks? This action cannot be reversed.`
          );
        }
      };
      handleSetDeleteContainer(deleteContainerName);
    } catch (error) {
      console.log('there is an error for displaying the container name', error);
    }
  }, [deleteContainerName, deleteContainerItemName]);

  const { theme } = useTheme();
  // styling background based on theme
  const themeStyle: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // handling the canceling button
  const handleCancel = () => {
    setEditDelBoardCon('');
    return true;
  };

  return (
    <>
      <div
        className="deleteContainer"
        style={themeStyle}
        data-testid="deleteCon"
      >
        <article className="font-bold">
          Delete this {deleteContainerTitle}
        </article>
        <p className="deleteText font-medium leading-6">
          {deleteContainerText}
        </p>
        <div className="btnContainer">
          <DestructiveBtn buttonName="Delete" />
          <CancelBtn buttonName="Cancel" onClick={handleCancel} />
        </div>
      </div>
    </>
  );
};
