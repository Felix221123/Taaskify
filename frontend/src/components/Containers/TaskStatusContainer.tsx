import React, { useEffect } from 'react';
import { useTheme } from '../../Context/Theme/UseTheme';
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

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
  status,
  setStatus,
  columns,
  containerName,
}) => {
  const { theme } = useTheme();

  // Input color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // Title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // Handles the form submission
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // Directly set status from the parent
  };

  // Ensure current status is passed and avoid setting a default if the status is already set
  useEffect(() => {
    if (!status && columns.length > 0) {
      const defaultStatus = columns[0].id; // Set default to the first column
      setStatus(defaultStatus); // Update parent state with default
    }
  }, [status, columns, setStatus]);


  return (
    <div className="card">
      <label htmlFor="taskStatus" className="font-bold" style={TextColorOnChange}>
        {containerName}
        <div className="select-container cursor-pointer">
          <select
            value={status} // Directly use status from props
            onChange={handleStatusChange}
            style={TitleColorOnChange}
            className="dropdownContainer w-full h-10 font-medium"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id} style={TitleColorOnChange}>
                {CapitaliseAfterSpace( column.name )}
              </option>
            ))}
          </select>
          <ChevronIconDown className="chevron-icon" />
        </div>
      </label>
    </div>
  );
};
