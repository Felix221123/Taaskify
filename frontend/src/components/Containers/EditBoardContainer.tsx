import React, { useState } from 'react';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { EditProps } from '../Interface/EditBoardInterface';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { BoardColumnContainer } from './BoardColumnContainer';
import { useForm } from 'react-hook-form';
import { useUser } from '../../Context/useUser';
import { CapitaliseAfterSpace } from '../../utils/CapitaliseAfterSpace';
import EditBoardApi from '../../packages/Api/BoardApi/EditBoardApi';
import { openCustomNotification } from '../../utils/notificationUtil';
import { NotificationContainerStyle } from '../../utils/NotificationContainerStyle';
import { SuccessIcon } from '../../Icons/SuccessIcon';
import { ErrorIcon } from '../../Icons/ErrorIcon';



interface EditBoardFormData {
  boardName: string;
  columns: Array<{ name: string, tasks: [] }>;
}


export const EditBoardContainer = ({ name, boardID, columns, onCloseProp }: EditProps) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<EditBoardFormData>({
    defaultValues: {
      boardName: name || '',
      columns: columns || [{ name: 'Todo' }],
    },
  });
  const [boardError, setBoardError] = useState<string | null>(null);

  // pulling data for useContext
  const { theme } = useTheme();
  const { user } = useUser();

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

  console.log(boardID, columns);

  // Submit handler
  const onSubmit = async (data: EditBoardFormData) => {
    try {
      // passing the user's id from the useUser context
      const userID = user?.user._id;
      const boardName = CapitaliseAfterSpace(data.boardName) || "";

      // calling the edit board api for a user
      await EditBoardApi({ userID, boardID, name: boardName, columns: data.columns });

      onCloseProp();   // close container after a successful editing

      reset();    // reset the form

      console.log(`form has been submitted here`);
      // notification for editing board successfully
      openCustomNotification(
        <>
          <NotificationContainerStyle message="Board Updated">
            <SuccessIcon />
          </NotificationContainerStyle>
        </>,
        <>Your board has been successfully updated.</>
      );

    } catch (err) {
      // passing a string and a notification component to a state when there is an error in editing a board
      setBoardError('Failed to edit the board. Please try again.');
      openCustomNotification(
        <NotificationContainerStyle message='Error'>
          <ErrorIcon />
        </NotificationContainerStyle>,
        <>Failed to edit the board. Please ensure there is a "Board Name".</>
      );
      console.error(err);
    }
  };


  return (
    <>
      <div
        className="editBoardContainer"
        style={boardContainerTheme}
        data-testid="editContainer"
      >
        <article className="editBoardText font-bold" style={TitleColorOnChange}>
          Edit Board
        </article>
        <form action="" onSubmit={handleSubmit(onSubmit)} method='patch'>
          <div className="boardNameContainer">
            <label
              htmlFor="boardName"
              className="font-bold"
              style={TextColorOnChange}
            >
              Board Name
              <input
                type="text"
                id="boardName"
                {...register('boardName', { required: true })}
                className="font-medium leading-6"
                placeholder="e.g. Web Design"
                style={{
                  ...TitleColorOnChange,
                  ...(errors.boardName || boardError ? { border: "2px solid red", outline: "none" } : {})
                }}
              />
            </label>
            {boardError && <span className="error-text text-xs text-center text-red-500">{boardError}</span>}
          </div>
          <BoardColumnContainer control={control} />
          <PrimaryBtnSmall buttonName="Save Changes" btnType='submit' />
        </form>
      </div>
    </>
  );
};

