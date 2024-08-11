import { FetchData } from "../../FetchManager/fetchData";



const LogOutUserApi = async():Promise<void> => {
  const Port = `http://localhost:5500`;     //defining the backend port
  const logOutPort = `${Port}/api/user/logout`;

  // making an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include your authentication token here
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };

  const response = await FetchData(logOutPort, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw { status: response.status, ...errorData };
  }
  console.log(`user has been logged out successfully`);

  return response.json();
}

export default LogOutUserApi
