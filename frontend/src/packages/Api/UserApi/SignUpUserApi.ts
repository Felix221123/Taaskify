import { SignUpUserProps, UserSignUpData } from "../../../components/Interface/UserApiInterface"
import { FetchData } from "../../FetchManager/fetchData";


const SignUpUserApi = async (signUpCredentials:SignUpUserProps):Promise<UserSignUpData> => {
  const Port = `http://localhost:5500`;     //defining the backend port
  const signUpPort = `${Port}/api/user/signup`;            // defining the route for sign up


  // passing in the fields required in the server side
  const {firstName , lastName, emailAddress, password }  = signUpCredentials


  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({firstName, lastName, emailAddress, password}),
  };

  const response = await FetchData(signUpPort, options);

  if (!response.ok) {
    // Throw the entire response object
    const errorData = await response.json();
    console.log(errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default SignUpUserApi
