import { ResetPasswordProps } from "../../../components/Interface/UserApiInterface"
import { FetchData } from "../../FetchManager/fetchData";


const ResetPasswordUserApi = async (resetProps:ResetPasswordProps):Promise<string> => {
  const Port = import.meta.env.VITE_TAASKIFY_APP_BACKEND_URL || `http://localhost:5500`;
  const resetPasswordPort = `${Port}/api/user/reset-password/`

  // destructing the props data
  const {token , newPassword} = resetProps

  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({ token , newPassword }),
  };

  // using the fetch method to post data
  const response = await FetchData(resetPasswordPort, options);

  if (!response.ok) {
    // Throw the entire response object
    const errorData = await response.json();
    console.log(errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default ResetPasswordUserApi
