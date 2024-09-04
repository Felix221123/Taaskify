import { useTheme } from '../../Context/Theme/UseTheme';
import { useState } from 'react';
import { ButtonProps } from '../Interface/ButtonInterface';
import React from 'react';
import './button-styles.css';

export const AddNewColumnBtn = ({ buttonName, onClickProp }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Event handlers to toggle hover state
  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  // context provider for changing themes
  const { theme } = useTheme();

  // sets the color of the buttons based on the theme chosed by the user
  const themeStyle: React.CSSProperties = {
    color: theme === 'light' ? '#FFFFFF' : '#FFFFFF',
    backgroundColor: theme === 'light' ? '#635FC7' : '#A8A4FF',
  };

  // setting the hover state of the button
  const hoverBtnStyle: React.CSSProperties = {
    backgroundColor: '#A8A4FF',
    transition: 'all 0.5s',
  };

  const combinedStyles = isHovered
    ? { ...themeStyle, ...hoverBtnStyle }
    : themeStyle;

  return (
    <button
      className="AddNewColumnBtn font-bold cursor-pointer"
      style={combinedStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      data-testid="custom-addnewColumn-button"
      onClick={onClickProp}
    >
      {buttonName}
    </button>
  );
};
