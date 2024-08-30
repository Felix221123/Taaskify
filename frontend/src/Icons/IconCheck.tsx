import { useEffect, useState } from 'react';
import './iconsStyles.css';
import { iconCheckProps } from '../components/Interface/AddTaskInterface';

export const IconCheck = ({ index, onToggle, isCompleted }: iconCheckProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(isCompleted);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggle(newCheckedState);
  };

  useEffect(() => {
    setIsChecked(isCompleted);
  }, [isCompleted]);

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
