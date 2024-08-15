import React from 'react'
import "./formsStyles.css"
import Email from "/src/assets/email.svg"




export const ForgotPassword: React.FC = () => {
  return (
    <>
      <div className="forgotPasswordMainContainer">
        <div className="Intro flex flex-col gap-y-3">
          <article className="textClr1 font-bold text-left text-2xl">Reset Password</article>
          <p className="textClr1 text text-left font-normal text-base">Please enter your email to receive a verification link to reset your email</p>
        </div>
        <form action="">
          <div className="flex-column">
            <label htmlFor="emailAddress"></label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input
              placeholder="Enter your Email"
              id="emailAddress"
              // {...register("emailAddress", { required: "Email is required" })}
              className="input"
              type="text"
            // style={errors.emailAddress || logInError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          <button className="button-submit" type="submit">Send Link</button>
        </form>


      </div>
    </>
  )
}

