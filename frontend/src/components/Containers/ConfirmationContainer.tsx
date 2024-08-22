import React, { useEffect, useState } from 'react'
import ConfirmationIcon from "/src/assets/emailConfirm.svg"
import "./ContainersStyles.css"
import { ConfirmationContainerProps } from '../Interface/UserApiInterface'
import { useNavigate } from 'react-router-dom'



export const ConfirmationContainer: React.FC<ConfirmationContainerProps> = ({ containerName }) => {
  const [nameOfContainer, setNameOfContainer] = useState<string>("");

  // calling the useNavigate hook
  const navigate = useNavigate()

  const handleNavigation = () => {
    navigate("/login");
  }


  // useEffect hook to determine which the container text
  useEffect(() => {
    try {
      const handleSetDeleteContainer = (title: string) => {
        if (title.toLowerCase() === 'forgotpassword') {
          setNameOfContainer('The link to reset your password has been successfully sent to your email.');
        }
        else if (title.toLowerCase() === 'updatepassword') {
          setNameOfContainer('Your Taaskify password has been successfully updated.');
        }

      };
      handleSetDeleteContainer(containerName);
    } catch (error) {
      console.log('there is an error for displaying the container name', error);
    }
  }, [containerName])

  return (
    <>
      <div className="emailConfirmationContainer">
        <img src={ConfirmationIcon} alt="email verification icon" />
        {containerName !== "resetpassword" && (
          <p className='font-bold text-center'>{nameOfContainer}</p>
        )}
        {containerName === "resetpassword" && (
          <p className="font-medium text-center">
            Your password has been successfully reset. You can now{" "}
            <a
              className="underline text-blue-500 font-bold cursor-pointer"
              onClick={handleNavigation}
              target='_blank'
            >
              Log In
            </a>{" "}
            to your Taaskify account.
          </p>
        )}
      </div>
    </>
  )
}


