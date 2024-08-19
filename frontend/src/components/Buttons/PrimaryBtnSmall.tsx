import { useTheme } from '../../Context/UseTheme';
import { useState } from 'react';
import { ButtonProps } from '../Interface/ButtonInterface';
import React from 'react';
import './button-styles.css';

export const PrimaryBtnSmall = ({ buttonName,onClickProp }: ButtonProps) => {
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
    backgroundColor: theme === 'light' ? '#635FC7' : '#635FC7',
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
    <>
      <button
        className="primaryBtnSmall font-bold leading-6 cursor-pointer uppercase"
        style={combinedStyles}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        data-testid="custom-primary-button"
        onClick={onClickProp}
      >
        {buttonName}
      </button>
    </>
  );
};
