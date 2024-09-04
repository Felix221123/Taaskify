import React, {useState, useEffect} from 'react'
import "./formsStyles.css"
import Password from "/src/assets/password.svg"
import { useForm } from 'react-hook-form';
import { ResetUserPasswordFormProps } from '../components/Interface/UserApiInterface';
import ResetPasswordUserApi from '../packages/Api/UserApi/ResetPasswordUserApi';
import {  useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loading } from '../components/Containers/Loading';
import "../components/Containers/ContainersStyles.css"
import { ConfirmationContainer } from '../components/Containers/ConfirmationContainer';




export const ResetPassword: React.FC = () => {
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");


  // Getting the current location object
  const location = useLocation();

  // Extracting the token from the URL query parameters
  const token = new URLSearchParams(location.search).get('token');


  // using the react hook forms to define the reset password for users
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetUserPasswordFormProps>();

  // keep tracking of the confirm password section to make sure it matches the newPassword
  const newPassword = watch("newPassword");


  // async function to allow users to reset their password
  async function onResetPasswordSubmit(resetPasswordProps:ResetUserPasswordFormProps) {

    try {
      if (!token) {
        throw new Error("Invalid token. Please check your reset link.");
      }

      // passing in the credentials
      const user = await ResetPasswordUserApi({ ...resetPasswordProps, token});

      if (user) {
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          setPasswordResetSuccess(true);
        }, 4000); // Set to 4 seconds
      }

    } catch (error:any) {
      // Check if the error message is about the password being the same
      setPasswordError("New password cannot be the same as the old password.");
      console.log(`an expected error occurred at , ${error}`);
    }

  }


  // handles the bg color
  useEffect(() => {
    document.body.style.background = "rgb(0,14,36)";
    document.body.style.background = "linear-gradient(90deg, rgba(0,14,36,1) 4%)";
  }, []);

  // animations for navbar container on mobile
  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });


  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-10">
        <article data-testid="updatePasswordText" className="textClr font-bold text-center text-3xl">Reset Your Taaskify Password</article>
        <p className="textClr text text-center font-medium text-lg px-3">Please enter your new password to reset your Taaskify account</p>
      </div>
      <div className="formContainer mb-6" data-testid="resetPasswordContainer">
        <form className="ResetForm" action="" method='post' onSubmit={handleSubmit(onResetPasswordSubmit)}>
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
          <button className="button-submit" data-testid="resetBtn" type="submit" disabled={isSubmitting}>Reset Password</button>
        </form>
      </div>


      {/* calling the spin animation here */}
      <AnimatePresence>
        {loading && (
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


      {/* when the password has been successfully reset */}
      <AnimatePresence>
        {passwordResetSuccess && (
          <motion.div
            className="spinAnimation"
            initial={getMenuAnimationForSpin().hidden}
            animate={getMenuAnimationForSpin().visible}
            exit={getMenuAnimationForSpin().exit}
            transition={{ duration: 0.5 }}
            // ref={confirmationEmailContainer}
            data-testid="confirmationEmailContainer"
          >
            <ConfirmationContainer containerName="resetpassword"/>
          </motion.div>
        )}
      </AnimatePresence>




      {loading && <div id="overLayEffect"></div>}
      {passwordResetSuccess && <div id="overLayEffect"></div>}
    </>
  )
}


