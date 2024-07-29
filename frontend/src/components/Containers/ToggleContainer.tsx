import LightThemeImg from "/src/assets/icon-light-theme.svg";
import DarkThemeImg from "/src/assets/icon-dark-theme.svg";
import { useTheme } from "../../Context/UseTheme";
import "./ContainersStyles.css"

export const ToggleContainer = () => {
    // toggle onclick
    const { theme,toggleTheme } = useTheme();
    // toggle container bgColor
  const toggleBgTheme: React.CSSProperties = {
    backgroundColor: theme === "light" ? "#F4F7FD" : "#20212C",
  };
  
  return (
    <div className="toggleContainer" style={toggleBgTheme}>
      <img src={LightThemeImg} alt="light theme" />
      <div className="toggleBtn">
        <label className="switch">
          <input type="checkbox" onClick={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
      <img src={DarkThemeImg} alt="dark theme" />
    </div>
  );
};
