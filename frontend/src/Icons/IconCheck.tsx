import { useState } from "react";
import "./iconsStyles.css";
import { iconCheck } from "../components/Interface/AddTaskInterface";




export const IconCheck = ({ index, onToggle }: iconCheck) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
      onToggle(isChecked);
  };
    
  return (
    <>
      <div className="iconContainer" data-testid="iconCheckBtn">
        <label htmlFor={`cbx-${index}`} className="cbx" tabIndex={index}>
          <input
            type="checkbox"
            id={`cbx-${index}`}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
    </>
  );
};
