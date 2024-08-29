import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";

interface EditBoardProps {
  userID: string | undefined;
  boardID: string;
  name: string;
  columns?: Array<{ name: string; tasks: Array<string> }>;
}

const EditBoardApi = async (boardData: EditBoardProps): Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const editBoardUrl = `${Port}/api/user/board/editboard/`;

  // Make an options header for correct data posting
  const options = {
    method: "PATCH", // Use PATCH for partial updates
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(boardData),
  };

  const response = await FetchData(editBoardUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error editing board: ", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();
};

export default EditBoardApi;
