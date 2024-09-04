import UserBoardData from "../../../components/Interface/BoardApiInterface";
import { FetchData } from "../../FetchManager/fetchData";

interface UpdateSubtaskStatusProps {
  userID: string | undefined;
  boardID: string;
  columnID: string;
  taskID: string;
  subtaskID: string | undefined;
  isCompleted: boolean;
}

const UpdateSubtaskStatusApi = async (subtaskData: UpdateSubtaskStatusProps): Promise<UserBoardData> => {
  const Port = `http://localhost:5500`; // Define the backend port
  const updateSubtaskUrl = `${Port}/api/user/board/update-subtask-status/`; // Endpoint for updating subtask status

  // Make an options header for correct data posting
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies if needed
    body: JSON.stringify(subtaskData),
  };

  const response = await FetchData(updateSubtaskUrl, options);

  if (!response.ok) {
    // Handle errors by throwing the error data
    const errorData = await response.json();
    console.error("Error updating subtask status:", errorData);
    throw { status: response.status, ...errorData };
  }

  return response.json();
}

export default UpdateSubtaskStatusApi;
