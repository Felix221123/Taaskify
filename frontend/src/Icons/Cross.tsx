
import { useState } from "react";
interface ButtonProps{
    onClick?: () => void;
}
export const CrossIcon = ({ onClick}:ButtonProps) => {
    const [isHovered, setHovered] = useState<boolean>(false);
    const handleHovered = () => {
        setHovered(true);
    }
    const handleNotHovered = () => {
        setHovered(false);
    }
    
  return (
    <>
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" onMouseOver={handleHovered} onMouseLeave={handleNotHovered} onClick={onClick} className="cursor-pointer" data-testid="removeIcon">
        <g fill={isHovered ? "#EA5555" : "#828FA3"} fillRule="evenodd">
          <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
          <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
        </g>
      </svg>
    </>
  );
};
