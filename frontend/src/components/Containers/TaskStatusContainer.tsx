import React from 'react';
import { useTheme } from '../../Context/UseTheme';
import { ChevronIconDown } from '../../Icons/ChevronIconDown';



interface TaskStatusDropdownProps {
  control: any;
  name: string;
  status: string;
  setStatus: (status: string) => void;
  columns: string[];
}



export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({ status, setStatus, columns }) => {
  const { theme } = useTheme();

  // Input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // Title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div className="card">
      <label htmlFor="taskStatus" className="font-bold" style={TextColorOnChange}>
        Status
        <div className="select-container cursor-pointer">
          <select
            value={status}
            onChange={handleStatusChange}
            style={TitleColorOnChange}
            className="dropdownContainer w-full h-10"
          >
            <option value="" disabled>
              Select Status
            </option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          <ChevronIconDown className="chevron-icon" />
        </div>
      </label>
    </div>
  );
};
