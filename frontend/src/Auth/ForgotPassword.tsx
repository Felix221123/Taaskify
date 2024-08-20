import React, { useState } from 'react'
import "./formsStyles.css"
import Email from "/src/assets/email.svg"
import { ForgotPasswordProps, onForgotPasswordLinkSuccess } from '../components/Interface/UserApiInterface';
import { useForm } from 'react-hook-form';
import ForgotPasswordUserApi from '../packages/Api/UserApi/ForgotPasswordUserApi';
import "../components/Containers/ContainersStyles.css"


export const ForgotPassword: React.FC<onForgotPasswordLinkSuccess> = ({onLinkSuccess}) => {
  const [emailError , setEmailError] = useState<string>("")

  // using the react hook forms to define the forgot password props for users
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordProps>();

  // async function to allow users to enter their email address
  async function onForgotPassword(userEmailProps: ForgotPasswordProps) {

    try {
      // passing in the credentials
      const user = await ForgotPasswordUserApi(userEmailProps);

      // pass a boolean argument to the onLinkSuccess props when users email password was right
      if (user) {
        onLinkSuccess(true);
      }

      console.log(user);

    } catch (error) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setEmailError("There is no account with this email")
      console.log(errorMessage);
    }
  }



  return (
    <>
      <div className="forgotPasswordMainContainer">
        <div className="Intro flex flex-col gap-y-3">
          <article className="textClr1 font-bold text-left text-2xl">Forgot Your Taaskify Password?</article>
          <p className="textClr1 text text-left font-normal text-base">Please enter your email to receive a verification link to reset your email</p>
        </div>
        <form action="" method='post' onSubmit={handleSubmit(onForgotPassword)}>
          <div className="flex-column">
            <label htmlFor="emailAddress"></label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input
              placeholder="Enter your Email"
              id="emailAddress"
              {...register("emailAddress", { required: "Email is required" })}
              className="input"
              type="text"
              style={errors.emailAddress || emailError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          {emailError && <span className="error-text text-xs text-red-500">{emailError}</span>}
          <button className="button-submit" data-testid='sendEmailBtn' type="submit" disabled={isSubmitting}>Send Link</button>
        </form>
      </div>
    </>
  )
}

