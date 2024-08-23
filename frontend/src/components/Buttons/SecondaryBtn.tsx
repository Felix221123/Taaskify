import { useTheme } from '../../Context/UseTheme';
import { useState } from 'react';
import { ButtonProps } from '../Interface/ButtonInterface';
import React from 'react';
import './button-styles.css';

export const SecondaryBtn = ({ buttonName, onClickProp, btnType = 'button' }: ButtonProps) => {
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
    color: theme === 'light' ? '#635FC7' : '#635FC7',
    backgroundColor: theme === 'light' ? 'rgba(99, 95, 199,0.1)' : '#FFFFFF',
  };

  // setting the hover state of the button
  const hoverBtnStyle: React.CSSProperties = {
    backgroundColor: 'rgba(99, 95, 199,0.25)',
    transition: 'all 0.5s',
  };

  const combinedStyles = isHovered
    ? { ...themeStyle, ...hoverBtnStyle }
    : themeStyle;

  return (
    <button
      className="secondaryBtn font-bold leading-6 cursor-pointer"
      style={combinedStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClickProp}
      data-testid="custom-secondary-button"
      type={btnType}
    >
      {buttonName}
    </button>
  );
};
