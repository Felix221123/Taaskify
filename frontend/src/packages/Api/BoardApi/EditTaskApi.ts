import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";

interface EditTaskProps {
  userID: string | undefined;
  boardID: string;
  columnID: string;
  taskID: string;
  taskTitle: string;
  description: string;
  status: string;
  subtasks: Array<{ title: string; isCompleted: boolean }>;
}

const EditTaskApi = async (taskData: EditTaskProps): Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const editTaskUrl = `${Port}/api/user/board/edittask/`;

  // Make an options header for correct data posting
  const options = {
    method: "PATCH", // Use PATCH for partial updates
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(taskData),
  };

  const response = await FetchData(editTaskUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error editing task:", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();
};

export default EditTaskApi;
