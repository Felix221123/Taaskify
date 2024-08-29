import React, { useEffect, useState } from 'react';
import { useTheme } from '../../Context/UseTheme';
import { ChevronIconDown } from '../../Icons/ChevronIconDown';
import { CapitaliseAfterSpace } from '../../utils/CapitaliseAfterSpace';



interface TaskStatusDropdownProps {
  status: string;
  setStatus: (status: string) => void;
  columns: ColumnOption[];
  containerName: string;
}

interface ColumnOption {
  id: string;
  name: string;
}


export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({ status, setStatus, columns, containerName }) => {
  const { theme } = useTheme();
  // Local state to manage the status
  const [localStatus, setLocalStatus] = useState(status);

  // Input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // Title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // handles the form submission
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    setStatus(newStatus);
    console.log("Status selected:", newStatus);
  };



  useEffect(() => {
    if (!status && columns.length > 0) {
      setStatus(columns[0].id);
      console.log("Default status set:", columns[0].id);
    }
  }, [status, columns, setStatus]);



  return (
    <div className="card">
      <label htmlFor="taskStatus" className="font-bold" style={TextColorOnChange}>
        {containerName}
        <div className="select-container cursor-pointer">
          <select
            value={localStatus}
            onChange={handleStatusChange}
            style={TitleColorOnChange}
            className="dropdownContainer w-full h-10 font-medium"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id} style={TitleColorOnChange}>
                {CapitaliseAfterSpace(column.name)}
              </option>
            ))}
          </select>
          <ChevronIconDown className="chevron-icon" />
        </div>
      </label>
    </div>
  );
};
