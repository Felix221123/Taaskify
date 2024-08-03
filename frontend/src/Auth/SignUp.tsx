import Email from "/src/assets/email.svg"
import Password from "/src/assets/password.svg"
import Google from "/src/assets/google.svg"
import Apple from "/src/assets/apple.svg"
import "./formsStyles.css"


export const SignUp = () => {
  return (
    <>
      <div className="Intro flex flex-col gap-y-3 mt-10">
        <article className="font-bold text-center text-4xl text-blue-500">Sign Up to Taaskify</article>
        <p className="text text-center font-medium text-lg">Please fill the info to sign up</p>
      </div>
      <div className="formContainer">
        <form action="" className="LogInform flex flex-col gap-y-2">
          {/* user name */}
          <div className="UserName flex flex-row gap-x-4">
            <div className="flex flex-col gap-y-2">
              <label className="font-bold">First Name </label>
              <input placeholder="First Name" className="inputName rounded-lg font-normal py-3" type="text" />
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="font-bold">Last Name </label>
              <input placeholder="Last Name" className="inputName rounded-lg font-normal py-3" type="text" />
            </div>
          </div>

          {/* email and password */}
          <div className="flex-column">
            <label>Email </label>
          </div>
          <div className="inputForm">
            <img src={Email} alt="email icon" />
            <input placeholder="Enter your Email" className="input" type="text" />
          </div>
          <div className="flex-column">
            <label>Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input placeholder="Enter your Password" className="input" type="password" />
          </div>
          <div className="flex-column">
            <label>Confirm Password </label></div>
          <div className="inputForm">
            <img src={Password} alt="password icon" />
            <input placeholder="Confirm your Password" className="input" type="password" />
          </div>
          <button className="button-submit" type="submit">Sign Up</button>

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
            Already have an account? <span className="span">Log In</span>
          </p>

        </form>
      </div>
    </>
  );
};
