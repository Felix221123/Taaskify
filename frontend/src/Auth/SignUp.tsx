import React, { useState, useEffect } from "react"
import Email from "/src/assets/email.svg"
import Password from "/src/assets/password.svg"
import { useNavigate } from "react-router-dom"
import "./formsStyles.css"
import { useForm } from "react-hook-form"
import { SignUpModalProps, SignUpUserProps } from "../components/Interface/UserApiInterface"
import SignUpUserApi from "../packages/Api/UserApi/SignUpUserApi"
import { AnimatePresence, motion } from "framer-motion"
import { Loading } from "../components/Containers/Loading"
import "../components/Containers/ContainersStyles.css"
import { useUser } from "../Context/User/useUser"


export const SignUp: React.FC<SignUpModalProps> = ({ onSignUpSuccessful }) => {
  // state to track email error messages
  const [emailApiError, setEmailApiError] = useState<string | null>(null);
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);

  // using the react hook forms to define the signup for users
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignUpUserProps>();

  // calling the useNavigate component
  const navigate = useNavigate();

  // useContext for users
  const { setUser } = useUser()



  // function to handle routing
  const handleNavigation = (route: string) => {
    const routeFormat = route.replace(/\s+/g, '-').toLowerCase()
    navigate(`/${routeFormat}/`)
  };


  // async function function to allow users to sign up
  async function onSignUpSubmit(signUpCredentials: SignUpUserProps) {
    try {
      // passing new users credentials to the api in order to sign them up
      const newUser = await SignUpUserApi(signUpCredentials);
      if (newUser) {
        setSuccessfulSignUp(true);
        onSignUpSuccessful(newUser);
        setUser(newUser);

        // Delay navigation by 10 seconds
        setTimeout(() => {
          setSuccessfulSignUp(false);
          navigate("/taaskify");
        }, 5000);
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        // Capture only the first line of the error message
        errorMessage = error.message.split('\n')[0];
      }
      console.log(errorMessage);
      setEmailApiError(errorMessage);
    }
  }

  const password = watch("password"); // watch the value of password field


  // animations for navbar container on mobile
  const getMenuAnimationForSpin = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

    // handles the bg color
    useEffect(() => {
      document.body.style.background = "rgb(0,14,36)";
      document.body.style.background = "linear-gradient(90deg, rgba(0,14,36,1) 4%)";
    }, []);


  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-14">
        <article className="textClr font-bold text-center text-4xl">Sign Up to Taaskify</article>
        <p className="textClr text text-center font-medium text-lg">Please fill the info to sign up</p>
      </div>

      <div className="formContainer mb-10" data-testid="signUpContainer">
        {/* forms submission here */}
        <form action="" method="post" onSubmit={handleSubmit(onSignUpSubmit)} className="LogInform flex flex-col gap-y-2">
          {/* user name */}
          <div className="UserName flex flex-row gap-x-4">
            {/* first name section */}
            <div className="flex flex-col gap-y-2">
              <label  htmlFor="firstName">First Name</label>
              <input
                placeholder="First Name"
                id="firstName"
                {...register("firstName", { required: "First Name is required" })}
                className="inputName rounded-lg font-normal py-3"
                type="text"
                style={errors.firstName ? { border: "2px solid red", outline: "none" } : {}}
              />
            </div>
            {/* last name section */}
            <div className="flex flex-col gap-y-2">
              <label  htmlFor="lastName">Last Name</label>
              <input
                placeholder="Last Name"
                id="lastName"
                {...register("lastName", { required: "Last Name is required" })}
                className="inputName rounded-lg font-normal py-3"
                type="text"
                style={errors.lastName ? { border: "2px solid red", outline: "none" } : {}}
              />
            </div>
          </div>

          {/* email section */}
          <div className="flex-column">
            <label htmlFor="emailAddress">Email </label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input
              placeholder="Enter your Email"
              id="emailAddress"
              {...register("emailAddress", { required: "emailAddress is required" })}
              className="input"
              type="text"
              style={errors.emailAddress || emailApiError ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          {emailApiError && <span className="error-text text-xs text-red-500">{emailApiError}</span>}

          {/* password section */}
          <div className="flex-column">
            <label htmlFor="password">Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Create your Password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="input"
              type="password"
              style={errors.password ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>

          {/* confirm password section */}
          <div className="flex-column">
            <label htmlFor="confirmPassword">Confirm Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input
              placeholder="Confirm your Password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              className="input"
              type="password"
              style={errors.confirmPassword ? { border: "2px solid red", outline: "none" } : {}}
            />
          </div>
          {errors.confirmPassword && <span className="error-text text-xs text-red-500">{errors.confirmPassword.message}</span>}
          <button className="button-submit" data-testid="SignUp" type="submit" disabled={isSubmitting}>Sign Up</button>

          <p className="p">
            Already have an account? <span className="span" data-testid="loginBtn" onClick={() => handleNavigation("login")}>Log In</span>
          </p>
        </form>
      </div>

      {/* calling the spin animation here */}
      <AnimatePresence>
        {successfulSignUp && (
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

      {successfulSignUp && <div id="overLayEffect"></div>}
    </>
  );
};
