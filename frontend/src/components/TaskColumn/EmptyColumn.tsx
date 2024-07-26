import { AddNewColumnBtn } from "../Buttons/AddNewColumnBtn"
import "./taskColumnStyles.css"


export const EmptyColumn = () => {

  return (
    <>
      <div className="emptyBoardContainer">
        <p className="text font-bold text-center" data-testid="emptyText">
          This board is empty. Create a new column
          to get started.
        </p>
        <AddNewColumnBtn buttonName="+ Add New Column" />
      </div>
    </>
  )
}

