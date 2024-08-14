import { UpdateLoggedInUsersPasswordProps } from "../../../components/Interface/UserApiInterface"
import { FetchData } from "../../FetchManager/fetchData";


const UpdateLoggedInUserPasswordApi = async (userPasswordProps:UpdateLoggedInUsersPasswordProps):Promise<string> => {
  const Port = `http://localhost:5500`;     //defining the backend port
  const updatePasswordPort = `${Port}/api/user/update-password`;


  // Removing confirmPassword before sending the request
  const { currentPassword, newPassword } = userPasswordProps;

  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: 'include',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  };

  const response = await FetchData(updatePasswordPort, options);

  
  // if response is not okk, it throws error here
  if (!response.ok) {
    // Throw the entire response object
    const errorData = await response.json();
    console.log(errorData);
    console.log(`throwing an error here because the response wasn't okk, ${errorData}`);

    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default UpdateLoggedInUserPasswordApi
