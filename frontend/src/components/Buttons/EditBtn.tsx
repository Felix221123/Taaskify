import { onClickPropsEditBtnProps } from "../Interface/AddTaskInterface";
import "./button-styles.css";

export const EditBtn = ({
  onClickEditBtn,
  className,
}: onClickPropsEditBtnProps) => {
  return (
    <>
      <button
        className={`${className} container cursor-pointer`}
        data-testid="editBtn"
        onClick={onClickEditBtn}
      >
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </button>
    </>
  );
};
