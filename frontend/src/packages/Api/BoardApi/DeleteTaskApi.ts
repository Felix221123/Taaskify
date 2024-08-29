import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";



interface DeleteTaskProp{
  userID: string | undefined;
  boardID: string;
  columnID: string;
  taskID:string;
}



const DeleteTaskApi = async (taskData: DeleteTaskProp):Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const deleteTaskUrl = `${Port}/api/user/board/deletetask/`;

  // Make an options header for correct data posting
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(taskData),
  };

  const response = await FetchData(deleteTaskUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error creating task:", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();

}

export default DeleteTaskApi

