import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";


interface CreateTaskProps {
  userID: string;
  boardID: string;
  columnID: string;
  taskTitle: string;
  description?: string;
  subtasks: Array<{ title: string }>;
}



const CreateTaskApi = async (taskData: CreateTaskProps):Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const createTaskUrl = `${Port}/api/user/board/createtask/`;

  // Make an options header for correct data posting
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(taskData),
  };

  const response = await FetchData(createTaskUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error creating task:", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();


}

export default CreateTaskApi
