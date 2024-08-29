import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";


interface DeleteBoardProps{
  userID: string | undefined;
  boardID: string;
}



const DeleteBoardApi = async(boardData: DeleteBoardProps):Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const deleteBoardUrl = `${Port}/api/user/board/deleteboard/`;

  // Make an options header for correct data posting
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(boardData),
  };

  const response = await FetchData(deleteBoardUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error creating task:", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();


}



export default DeleteBoardApi
