import { ForgotPasswordProps } from "../../../components/Interface/UserApiInterface";
import { FetchData } from "../../FetchManager/fetchData";


const ForgotPasswordUserApi = async (userEmailProps:ForgotPasswordProps):Promise<string> => {
  const Port = `http://localhost:5500`;
  const forgotPasswordPort = `${Port}/api/user/forgot-password/`;

  // destructing the email address from the props
  const { emailAddress } = userEmailProps;

  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ emailAddress }),
  };

  // using the fetch method to post the data
  const response = await FetchData(forgotPasswordPort, options);


  if (!response.ok) {
    // Throw the entire response object
    const errorData = await response.json();
    console.log(errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}


export default ForgotPasswordUserApi
