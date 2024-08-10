import Email from "/src/assets/email.svg"
import Password from "/src/assets/password.svg"
import Google from "/src/assets/google.svg"
import Apple from "/src/assets/apple.svg"
import { useNavigate } from "react-router-dom"
import "./formsStyles.css"
import { useEffect } from "react"


export const LogIn = () => {

  // calling the useNavigate component
  const navigate = useNavigate();

  // function to handle routing
  const handleNavigation = (route:string) => {
    const routeFormat = route.replace(/\s+/g, '-').toLowerCase()
    navigate(`/${routeFormat}/`)
  };

  // changing the bg of the body element in the App
  useEffect(() => {
    document.body.style.backgroundColor = "#F4F7FD"
  }, []);



  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-10">
        <article className="font-bold text-center text-3xl text-blue-500">Log In to Taaskify</article>
        <p className="text text-center font-medium text-lg px-3">Please log in with your email and password</p>
      </div>
      <div className="formContainer" data-testid="loginContainer">
        <form className="LogInform" action="">
          <div className="flex-column">
            <label htmlFor="emailAddress">Email </label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input placeholder="Enter your Email" id="emailAddress" className="input" type="text" />
          </div>
          <div className="flex-column">
            <label htmlFor="password">Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input placeholder="Enter your Password" id="password" className="input" type="password" />
          </div>

          <div className="flex-row">
            <div className="flex items-center gap-x-2">
              <input type="radio" />
              <label>Remember me </label>
            </div>
            <span className="span">Forgot password?</span>
          </div>
          <button className="button-submit">Sign In</button>
          <p className="p line">Or With</p>
          <div className="flex-row">
            <button className="btn google">
              <img src={Google} alt="google icon" />
              Google
            </button>
            <button className="btn apple">
              <img src={Apple} alt="apple icon" />
              Apple
            </button>
          </div>

          <p className="p">
            Don't have an account? <span className="span" data-testid="signUpBtn" onClick={() => handleNavigation("signup")}>Sign Up</span>
          </p>
        </form>
      </div>
    </>
  );
};
