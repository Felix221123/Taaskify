import React, { useEffect, useState } from 'react';
import { DeleteContainerProps } from '../Interface/DeleteContainerInterface';
import { DestructiveBtn } from '../Buttons/DestructiveBtn';
import { CancelBtn } from '../Buttons/CancelBtn';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { CapitaliseAfterSpace } from '../../utils/CapitaliseAfterSpace';
import DeleteBoardApi from '../../packages/Api/BoardApi/DeleteBoardApi';
import { openCustomNotification } from '../../utils/notificationUtil';
import { NotificationContainerStyle } from '../../utils/NotificationContainerStyle';
import { SuccessIcon } from '../../Icons/SuccessIcon';
import DeleteTaskApi from '../../packages/Api/BoardApi/DeleteTaskApi';
import { useUser } from '../../Context/useUser';

interface DeleteContainerPropsWithSetter extends DeleteContainerProps {
  setEditDelBoardCon: React.Dispatch<React.SetStateAction<string>>;
  boardID: string,
  columnID?: string,
  taskID?: string,
}



export const DeleteContainer = ({
  deleteContainerName,
  deleteContainerItemName,
  setEditDelBoardCon,
  boardID,
  columnID,
  taskID,
}: DeleteContainerPropsWithSetter) => {
  // const states to check which container is right to use
  const [deleteContainerTitle, setDeleteContainerTitle] = useState<string>('');
  const [deleteContainerText, setDeleteContainerText] = useState<string>('');

  //  useEffect used to set the correct title and description of the delete container
  useEffect(() => {
    try {
      const handleSetDeleteContainer = (title: string) => {
        if (title.toLowerCase() === 'board') {
          setDeleteContainerTitle('board');
          setDeleteContainerText(
            `Are you sure you want to delete the '${CapitaliseAfterSpace(deleteContainerItemName)}' board? This action will remove all columns and tasks and cannot be reversed.`
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
  const { user } = useUser()

  // styling background based on theme
  const themeStyle: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // handling the canceling button
  const handleCancel = () => {
    setEditDelBoardCon('');
    return true;
  };


  // handles form submission for the deletion of boards or task
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // getting the users ID
    const userID = user?.user._id || ""

    try {
      if (deleteContainerName.toLowerCase() === 'board' && boardID && userID) {
        const response = await DeleteBoardApi({ userID, boardID });

        if (response) {
          setEditDelBoardCon('');
          openCustomNotification(
            <>
              <NotificationContainerStyle message="Board Deleted">
                <SuccessIcon />
              </NotificationContainerStyle>
            </>,
            <>
              Board has been successfully deleted
            </>
          )
        }

      } else if (deleteContainerName.toLowerCase() === 'task' && boardID && columnID && taskID && userID) {
        const response = await DeleteTaskApi({ userID, boardID, columnID, taskID });

        if (response) {
          setEditDelBoardCon('');
          openCustomNotification(
            <>
              <NotificationContainerStyle message="Task Deleted">
                <SuccessIcon />
              </NotificationContainerStyle>
            </>,
            <>
              Task has been successfully deleted
            </>
          )
        }

      } else {
        console.error("Invalid delete parameters.");
      }

      setEditDelBoardCon(''); // Close the delete container on success
    } catch (error) {
      console.error("Error occurred while deleting:", error);
      alert(`Failed to delete the ${deleteContainerTitle}. Please try again.`);
    }
  };


  return (
    <>
      <div
        className="deleteContainer"
        style={themeStyle}
        data-testid="deleteCon"
      >
        <form action="" onSubmit={handleFormSubmit} method='delete'>
          <article className="font-bold">
            Delete this {deleteContainerTitle}
          </article>
          <p className="deleteText font-medium leading-6">
            {deleteContainerText}
          </p>
          <div className="btnContainer">
            <DestructiveBtn buttonName="Delete" btnType='submit' />
            <CancelBtn buttonName="Cancel" onClickProp={handleCancel} />
          </div>
        </form>
      </div>
    </>
  );
};
