import { useTheme } from "../../Context/UseTheme";
import { useState } from "react";
import { ButtonProps } from "../Interface/ButtonInterface";
import React from "react";
import "./button-styles.css";

export const DestructiveBtn = ({ buttonName , onClick }: ButtonProps) => {
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
    color: theme === "light" ? "#FFFFFF" : "#FFFFFF",
    backgroundColor: theme === "light" ? "#EA5555" : "#EA5555",
  };

  // setting the hover state of the button
  const hoverBtnStyle: React.CSSProperties = {
    backgroundColor: "#FF9898",
    transition: "all 0.5s",
  };

  const combinedStyles = isHovered
    ? { ...themeStyle, ...hoverBtnStyle }
    : themeStyle;

  return (
    <>
      <button
        className="deleteBtn font-bold leading-6 cursor-pointer"
        style={combinedStyles}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        data-testid="custom-destructive-button"
        onClick={onClick}
      >
        {buttonName}
      </button>
    </>
  );
};
