import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "./formsStyles.css"
import { useForm } from "react-hook-form";
import { UpdateLoggedInUsersPasswordProps } from "../components/Interface/UserApiInterface";
import Password from "/src/assets/password.svg"
import UpdateLoggedInUserPasswordApi from "../packages/Api/UserApi/UpdateLoggedInUserPassword";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../components/Containers/Loading";





export const UpdatePassword: React.FC = () => {
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("")


  // calling the useNavigate component
  const navigate = useNavigate();


  // animations for navbar container on mobile
  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });


  // using the react hook forms to define the signup for users
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<UpdateLoggedInUsersPasswordProps>();


  // watch the current password and new password fields
  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");


  // async function to allow users to reset their password if they are already logged in
  async function onPasswordReset(data: UpdateLoggedInUsersPasswordProps) {
    if (currentPassword === newPassword) {
      setPasswordError("Current and New Password must be different")
      return;
    }

    try {
      // passing in the users new credentials to allow users to update their password
      const user = await UpdateLoggedInUserPasswordApi(data);

      if (user) {
        setPasswordResetSuccess(true);
        console.log(user);

        // setting a time out for the screen to load
        setTimeout(() => {
          setPasswordResetSuccess(false);
          navigate("/taaskify");
        }, 5000); // Redirect the user after successful update
      }

    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        // Capture only the first line of the error message
        errorMessage = error.message.split('\n')[0];
      }
      console.log(errorMessage);
      console.log(`throwing an error here cos the response wasn't okk`);
    }
  }

  // handles the bg color
  useEffect(() => {
    document.body.style.background = "rgb(0,14,36)";
    document.body.style.background = "linear-gradient(90deg, rgba(0,14,36,1) 4%, rgba(166,17,180,0.013064600840336116) 100%, rgba(0,212,255,1) 100%)";
  }, []);



  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-10">
        <article data-testid="updatePasswordText" className="textClr font-bold text-center text-3xl">Update Your Password</article>
        <p className="textClr text text-center font-medium text-lg px-3">Please enter your current password and your new password</p>
      </div>
      <div className="formContainer" data-testid="loginContainer">
        <form className="LogInform" action="" method="post" onSubmit={handleSubmit(onPasswordReset)}>
          <div className="flex-column">
            <label htmlFor="password">Current Password </label>
          </div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Enter your Current Password"
              id="password"
              {...register("currentPassword", { required: "password is required" })}
              className="input"
              type="password"
              style={errors.currentPassword ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="password">New Password </label>
          </div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Enter your New Password"
              id="password"
              {...register("newPassword", { required: "New password is required" })}
              className="input"
              type="password"
              style={errors.newPassword || passwordError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          {passwordError && <span className="error-text text-xs text-red-500">{passwordError}</span>}
          <div className="flex-column">
            <label htmlFor="password">Confirm New Password </label>
          </div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Confirm New Password"
              id="password"
              {...register("confirmNewPassword", {
                required: "Please confirm your password",
                validate: value => value === newPassword || "Passwords do not match"
              })}
              className="input"
              type="password"
              style={errors.confirmNewPassword ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          {errors.confirmNewPassword && <span className="error-text text-xs text-red-500">{errors.confirmNewPassword.message}</span>}

          {/* btn here */}
          <button className="button-submit" data-testid="updateBtn" type="submit" disabled={isSubmitting}>Update Password</button>
        </form>
      </div>


      {/* calling the spin animation here */}
      <AnimatePresence>
        {passwordResetSuccess && (
          <motion.div
            className="spinAnimation"
            initial={getMenuAnimationForSpin().hidden}
            animate={getMenuAnimationForSpin().visible}
            exit={getMenuAnimationForSpin().exit}
            transition={{ duration: 0.5 }}
            data-testid="loadingSpin"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>


      {passwordResetSuccess && <div id="overLayEffect"></div>}
    </>
  )
}


