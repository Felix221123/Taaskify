import React from "react";
import { useTheme } from "../Context/Theme/UseTheme";

export const LogoutIcon:React.FC = () => {

  // handle theme change
  const { theme } = useTheme();

  // handles changing the color of the svg file
  const handleFillTheme = theme === 'light' ? '#635fc7' : '#e4ebfa';

  return (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={handleFillTheme} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12L1.21913 11.3753L0.719375 12L1.21913 12.6247L2 12ZM11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11V13ZM5.21913 6.3753L1.21913 11.3753L2.78087 12.6247L6.78087 7.6247L5.21913 6.3753ZM1.21913 12.6247L5.21913 17.6247L6.78087 16.3753L2.78087 11.3753L1.21913 12.6247ZM2 13H11V11H2V13Z" fill="#33363F" />
        <path d="M10 8.13193V7.38851C10 5.77017 10 4.961 10.474 4.4015C10.9479 3.84201 11.7461 3.70899 13.3424 3.44293L15.0136 3.1644C18.2567 2.62388 19.8782 2.35363 20.9391 3.25232C22 4.15102 22 5.79493 22 9.08276V14.9172C22 18.2051 22 19.849 20.9391 20.7477C19.8782 21.6464 18.2567 21.3761 15.0136 20.8356L13.3424 20.5571C11.7461 20.291 10.9479 20.158 10.474 19.5985C10 19.039 10 18.2298 10 16.6115V16.066" stroke="#33363F" strokeWidth="2" />
      </svg>

    </>
  )
}

export default LogoutIcon
