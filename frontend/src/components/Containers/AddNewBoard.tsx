import React, { useState } from "react";
import { PrimaryBtnSmall } from "../Buttons/PrimaryBtnSmall";
import { SecondaryBtn } from "../Buttons/SecondaryBtn";
import "./ContainersStyles.css";
import { useTheme } from "../../Context/UseTheme";
import { CrossIcon } from "../../Icons/Cross";



export const AddNewBoard = () => {
  const [boardName, setBoardName] = useState<string>("");

  // handling the onchange of the input
  const handleAddBoardOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
    console.log(boardName);
  };

  const { theme } = useTheme();

  // background theme colors
  const boardContainerTheme: React.CSSProperties = {
    backgroundColor: theme === "light" ? "#FFFFFF" : "#3E3F4E",
  };

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === "light" ? "#000112" : "#FFFFFF",
  };

  // input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === "light" ? "#828FA3" : "#FFFFFF",
  };
  return (
    <>
      <div className="editBoardContainer" style={boardContainerTheme} data-testid="addNewBoardContainer">
        <article className="editBoardText font-bold" style={TitleColorOnChange}>
          Add New Board
        </article>
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
              value={boardName}
              onChange={handleAddBoardOnChange}
              className="font-medium leading-6"
              style={TitleColorOnChange}
              placeholder="e.g. Web Design"
            />
          </label>
        </div>
        <BoardColumnContainerForNewBoards />
        <PrimaryBtnSmall buttonName="Save Changes" />
      </div>
    </>
  );
};

export const BoardColumnContainerForNewBoards:React.FC = () => {
  // const to keep track of the columns available
  const [boardColumns, setBoardColumns] = useState<string[]>(["Todo","Doing"]);

  const { theme } = useTheme();
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === "light" ? "#000112" : "#FFFFFF",
  };

  const TextColorOnChange: React.CSSProperties = {
    color: theme === "light" ? "#828FA3" : "#FFFFFF",
  };

  const addNewColumn = () => {
    setBoardColumns((prevColumns) => [...prevColumns, ""]);
    console.log("Add new column clicked. Current columns:", boardColumns);
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...boardColumns];
    newColumns[index] = value;
    setBoardColumns(newColumns);
  };

  const removeColumn = (index: number) => {
    const newColumns = boardColumns.filter((_, i) => i !== index);
    setBoardColumns(newColumns);
  };

  return (
    <>
      <div className="boardColumnsContainer">
        <p className="boardColumnsText font-bold" style={TextColorOnChange}>
          Board Columns
        </p>
        {/* TODO:CREATE A EDIT FOR THE COLUMNS BOARD */}
        <div className="containerForColumn">
          {boardColumns.map((column, index) => (
            <div className="eachColumnContainer" key={index}>
              <label htmlFor={`eachColumnBoard-${index}`}>
                <input
                  type="text"
                  id={`eachColumnBoard-${index}`}
                  value={column}
                  style={TitleColorOnChange}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                />
              </label>
              <CrossIcon onClick={() => removeColumn(index)}/>
            </div>
          ))}
        </div>

        <SecondaryBtn buttonName="+ Add New Column" onClick={addNewColumn} />
      </div>
    </>
  );
};
