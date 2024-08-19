import React from 'react'
import ConfirmationIcon from "/src/assets/emailConfirm.svg"
import "./ContainersStyles.css"



export const EmailSentConfirmationContainer: React.FC = () => {

  return (
    <>
      <div className="emailConfirmationContainer">
        <img src={ConfirmationIcon} alt="email verification icon" />
        <p className='font-bold text-center'>The link to reset your password has been successfully sent to your email.</p>
      </div>
    </>
  )
}


