import React from 'react';
import { SettingsProfileProps } from '../Interface/ProfileProps';
import { GetUsersFirstLetterOfNames } from '../../utils/GetFirstLetterOfName';
import { PrimaryBtnSmall } from '../Buttons/PrimaryBtnSmall';
import './ContainersStyles.css';
import { useTheme } from '../../Context/UseTheme';
import LogoutIcon from '../../Icons/LogoutIcon';
import { useNavigate } from 'react-router-dom';
import LogOutUserApi from '../../packages/Api/UserApi/LogOutUserApi';



export const ProfileContainer: React.FC<SettingsProfileProps> = ({
  firstName,
  lastName,
  emailAddress,
  isLoggingOut
}) => {
  // useContext theme
  const { theme } = useTheme();

  // background theme colors
  const ContainerBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // text color theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  // changing the background color based theme color change
  const toggleProfileBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#F4F7FD' : '#20212C',
  };

  const handleNameColorTheme: React.CSSProperties = {
    color: theme === 'light' ? '#635fc7' : '#e4ebfa',
  };

  // calling the useNavigate component
  const navigate = useNavigate();

  // function to handle logout function
  const handleLogout = async () => {
    try {
      // Call the logout API function
      await LogOutUserApi();

      isLoggingOut('loggingOutUser');

      // Redirect to the login page
      setTimeout(() => {
        navigate("/login");
      }, 5000);

      console.log(`user has been logged out`);

    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // function to handle the reset password
  const handleResetPassword = () => {
    console.log(`here is running`);
    navigate("/update-password");
  }


  return (
    <>
      <div
        className="profileContainer"
        data-testid="profileContainer"
        style={ContainerBgTheme}
      >
        <div className="profileCircle font-medium" style={toggleProfileBgTheme}>
          <span style={handleNameColorTheme}>
            {GetUsersFirstLetterOfNames(firstName, lastName)}
          </span>
        </div>
        <div
          className="userName font-medium uppercase text-center"
          style={TextColorOnChange}
        >{`${firstName.toUpperCase()}  ${lastName.toUpperCase()}`}</div>
        <div
          className="emailAddress font-medium uppercase text-center"
          style={TextColorOnChange}
        >
          email : {emailAddress.toUpperCase()}
        </div>
        <button className='logoutBtn uppercase font-bold' onClick={handleLogout}>
          <LogoutIcon />
          <span style={TextColorOnChange}>logout</span>
        </button>

        <PrimaryBtnSmall buttonName="update password" onClickProp={handleResetPassword} />
      </div>
    </>
  );
};
