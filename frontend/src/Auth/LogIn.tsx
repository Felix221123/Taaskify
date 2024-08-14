import Email from "/src/assets/email.svg"
import Password from "/src/assets/password.svg"
import { useNavigate } from "react-router-dom"
import "./formsStyles.css"
import React, { useEffect, useState } from "react"
import { LogInModalProps, LogInUserProps } from "../components/Interface/UserApiInterface"
import { useForm } from "react-hook-form"
import LogInUserApi from "../packages/Api/UserApi/LogInUserApi"
import { AnimatePresence, motion } from "framer-motion"
import { Loading } from "../components/Containers/Loading"
import "../components/Containers/ContainersStyles.css"





export const LogIn: React.FC<LogInModalProps> = ({ onLogInSuccessful }) => {
  const [successfulLogIn, setSuccessfulLogIn] = useState<boolean>(false);
  const [logInError, setLogInError] = useState<boolean>(false);

  // calling the useNavigate component
  const navigate = useNavigate();

  // function to handle routing
  const handleNavigation = (route: string) => {
    const routeFormat = route.replace(/\s+/g, '-').toLowerCase()
    navigate(`/${routeFormat}/`)
  };

  // changing the bg of the body element in the App
  useEffect(() => {
    document.body.style.backgroundColor = "#F4F7FD"
  }, []);

  // using the react hook forms to define the login for users
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LogInUserProps>();

  // async function to allow users to login to the application
  async function onLogInSubmit(logInCredentials:LogInUserProps) {
    try {
      // passing in users credentials to log them in
      const user = await LogInUserApi(logInCredentials);
      if (user){
        setSuccessfulLogIn(true);
        setLogInError(false);
        onLogInSuccessful(user);

        
        // Delay navigation by 10 seconds
        setTimeout(() => {
          setSuccessfulLogIn(false);
          navigate("/taaskify");
        }, 5000);
      }

      console.log(`user has been successfully logged in`);


    } catch (error) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      setLogInError(true);
    }
  }

  // animations for navbar container on mobile
  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-10">
        <article className="font-bold text-center text-3xl text-blue-500">Log In to Taaskify</article>
        <p className="text text-center font-medium text-lg px-3">Please log in with your email and password</p>
      </div>
      <div className="formContainer" data-testid="loginContainer">
        <form className="LogInform" action="" method="post" onSubmit={handleSubmit(onLogInSubmit)}>
          <div className="flex-column">
            <label htmlFor="emailAddress">Email </label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input
              placeholder="Enter your Email"
              id="emailAddress"
              {...register("emailAddress", { required: "Email is required" })}
              className="input"
              type="text"
              style={errors.emailAddress || logInError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          <div className="flex-column">
            <label htmlFor="password">Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Enter your Password"
              id="password"
              {...register("password", { required: "password is required" })}
              className="input"
              type="password"
              style={errors.password || logInError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>

          <div className="flex-row">
            <div className="flex items-center gap-x-2">
              <input type="radio" />
              <label>Remember me </label>
            </div>
            <span className="span">Forgot password?</span>
          </div>
          {logInError && <span className="error-text text-xs text-center text-red-500">Invalid Credentials</span>}
          <button className="button-submit" type="submit" disabled={isSubmitting}>Sign In</button>

          <p className="p">
            Don't have an account? <span className="span" data-testid="signUpBtn" onClick={() => handleNavigation("signup")}>Sign Up</span>
          </p>
        </form>
      </div>

      {/* calling the spin animation here */}
      <AnimatePresence>
        {successfulLogIn && (
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


      {successfulLogIn && <div id="overLayEffect"></div>}
    </>
  );
};
