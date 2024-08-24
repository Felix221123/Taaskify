import React, { useState } from 'react';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { CrossIcon } from '../../Icons/Cross';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import CreateNewBoardApi from '../../packages/Api/BoardApi/CreateNewBoardApi';
import { useUser } from '../../Context/useUser';
import { openCustomNotification } from '../../utils/notificationUtil';
import { SuccessIcon } from '../../Icons/SuccessIcon';
import { ErrorIcon } from '../../Icons/ErrorIcon';
import { OnContainerCloseProp } from '../Interface/Boards';
import { NotificationContainerStyle } from '../../utils/NotificationContainerStyle';


interface CreateBoardFormData {
  boardName: string;
  columns: Array<{ name: string, tasks: [] }>;
}




export const AddNewBoard: React.FC<OnContainerCloseProp> = ({ onCloseContainer }) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CreateBoardFormData>({
    defaultValues: {
      boardName: '',
      columns: [{ name: 'Todo' }],
    },
  });
  const [boardError, setBoardError] = useState<string | null>(null);

  // useTheme and useUser context
  const { theme } = useTheme();
  const { user } = useUser()

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

  // Submit handler
  const onSubmit = async (data: CreateBoardFormData) => {
    try {
      // passing the users id from the useUser context
      const userID = user?.user._id;

      // calling the create new board api for a user
      await CreateNewBoardApi({ userID, name: data.boardName, columns: data.columns });

      reset(); // Reset form after successful submission

      console.log(`forms has been submitted here`);
      // notification for creating boards successfully
      openCustomNotification(
        <>
          <NotificationContainerStyle message="Board Created">
            <SuccessIcon />
          </NotificationContainerStyle>
        </>,
        <>Your new board has been successfully created.</>
      );

      // calling the container after a successful board creating
      onCloseContainer()

    } catch (err) {
      // passing a string and a notification component to a state when there is an error in creating a board
      setBoardError('Failed to create the board. Please try again.');
      openCustomNotification(
        <NotificationContainerStyle message='Error'>
          <ErrorIcon />
        </NotificationContainerStyle>,
        <>Failed to create the board. Please try again.</>
      );
      console.error(err);
    }

  };


  return (
    <>
      <div
        className="editBoardContainer"
        style={boardContainerTheme}
        data-testid="addNewBoardContainer"
      >
        <article className="editBoardText font-bold" style={TitleColorOnChange}>
          Add New Board
        </article>
        <form action="" onSubmit={handleSubmit(onSubmit)} method='post'>
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
          <BoardColumnContainerForNewBoards control={control} />
          <PrimaryBtnSmall buttonName="Create New Board" btnType='submit' />
        </form>
      </div>
    </>
  );
};







interface BoardColumnProps {
  control: any;
}


export const BoardColumnContainerForNewBoards: React.FC<BoardColumnProps> = ({ control }) => {
  // const to keep track of the columns available
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  const { theme } = useTheme();
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };



  return (
    <>
      <div className="boardColumnsContainer">
        <p className="boardColumnsText font-bold" style={TextColorOnChange}>
          Board Columns
        </p>
        {/* TODO:CREATE A EDIT FOR THE COLUMNS BOARD */}
        <div className="containerForColumn">
          <div className="scrollableContainer">
            {fields.map((field, index) => (
              <div className="eachColumnContainer" key={field.id}>
                <label htmlFor={`eachColumnBoard-${index}`}>
                  <Controller
                    control={control}
                    name={`columns.${index}.name`}
                    render={({ field }) => (
                      <input
                        type="text"
                        id={`eachColumnBoard-${index}`}
                        style={TitleColorOnChange}
                        {...field}
                      />
                    )}
                  />
                </label>
                <CrossIcon onClick={() => remove(index)} />
              </div>
            ))}
          </div>
        </div>

        <SecondaryBtn buttonName="+ Add New Column" onClickProp={() => append({ name: '' })} btnType='button' />
      </div>
    </>
  );
};
