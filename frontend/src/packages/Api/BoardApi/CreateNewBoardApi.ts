import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";


interface CreateBoardProps {
  userID: string | undefined;
  name: string;
  columns?: Array<{ name: string; tasks: Array<string> }>;
}



const CreateNewBoardApi = async (boardData:CreateBoardProps):Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const createBoardUrl = `${Port}/api/user/board/createboard/`;

  // Make an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(boardData),
  };

  const response = await FetchData(createBoardUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error creating board: ", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default CreateNewBoardApi
