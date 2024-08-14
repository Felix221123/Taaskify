import { LogInUserProps, UserLogInData } from "../../../components/Interface/UserApiInterface"
import { FetchData } from "../../FetchManager/fetchData";


const LogInUserApi = async (logInCredentials:LogInUserProps):Promise<UserLogInData> => {
  const Port = `http://localhost:5500`;     //defining the backend port
  const logInPort = `${Port}/api/user/login`;

  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(logInCredentials),
  };

  const response = await FetchData(logInPort, options);

  if (!response.ok) {
    // Throw the entire response object
    const errorData = await response.json();
    console.log(errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default LogInUserApi
