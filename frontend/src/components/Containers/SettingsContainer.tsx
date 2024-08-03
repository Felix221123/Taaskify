import React from 'react';
import { GetUsersFirstLetterOfNames } from '../../utils/GetFirstLetterOfName';
import { ProfileProps } from '../Interface/ProfileProps';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import { SettingsIcon } from '../../Icons/SettingsIcon';

export const SettingsContainer: React.FC<ProfileProps> = ({
  firstName,
  lastName,
  onClickProps,
}) => {
  // theme context
  const { theme } = useTheme();

  // changing the background color based theme color change
  const toggleBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#F4F7FD' : '#20212C',
  };

  const handleColorTheme: React.CSSProperties = {
    color: theme === 'light' ? '#635fc7' : '#e4ebfa',
  };

  return (
    <>
      <div className="settingsContainer" data-testid="settingsContainer">
        <div
          className="avatarCircle font-normal"
          data-testid="avatarCircle"
          style={toggleBgTheme}
        >
          <span style={handleColorTheme}>
            {GetUsersFirstLetterOfNames(firstName, lastName)}
          </span>
        </div>
        <div
          onClick={onClickProps}
          className="cursor-pointer"
          data-testid="settingsIcon"
        >
          <SettingsIcon />
        </div>
      </div>
    </>
  );
};
