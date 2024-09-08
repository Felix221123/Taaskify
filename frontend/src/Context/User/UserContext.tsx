import React, { createContext, useEffect, useRef, useState } from 'react';
import { UserData } from '../../components/Interface/UserApiInterface';
import { FetchData } from '../../packages/FetchManager/fetchData';
import io from "socket.io-client"
import { useBoard } from '../Board/useBoardContext';


export interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Create a reference to store the current user state
  const userRef = useRef<UserData | null>(null);


  // calling the current boards index to be used here in the userContext
  const { activeBoardIndex, changeBoard } = useBoard();

  // Keep the ref updated with the latest user state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Setup a single socket connection (singleton pattern)
  const socket = React.useMemo(() => io('http://localhost:5500', { withCredentials: true }), []); // Connect only once on component mount


  // useEffect tpo handle fetch request when users refresh the site
  useEffect(() => {
    // method to handle on app load
    const fetchUserData = async () => {
      try {
        const Port = `http://localhost:5500`;
        const validatePort = `${Port}/api/user/validate`;

        // making an options header for correct data posting
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        };

        // variable to fetch data from the server side
        const response = await FetchData(validatePort, options);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData(); // Fetch user data when the app loads

    // Listen for the "new-board" event from the server
    socket.on('new-board', (data) => {
      const currentUser = userRef.current;
      console.log(`user is connected ${currentUser}, ${socket.id}`);

      if (currentUser && currentUser.user._id === data.userID) {
        // Check if the received board has an id
        if (data.board && data.board._id) {
          // Update the user's boards when a new board is created
          setUser((prevUser) => {
            if (!prevUser) return prevUser;
            return {
              ...prevUser,
              user: {
                ...prevUser.user,
                boards: [...prevUser.user.boards, data.board],
              },
            };
          });
        } else {
          console.error("Received board data is missing an id");
        }
      }
    });

    // Listen for the "update-board" event from the server
    socket.on('update-board', (data) => {
      const currentUser = userRef.current;

      if (currentUser && currentUser.user._id === data.userID) {
        // Check if the received board has an id
        if (data.board && data.board._id) {
          // Update the user's boards when a board is updated
          setUser((prevUser) => {
            if (!prevUser) return prevUser;
            const updatedBoards = prevUser.user.boards.map(board =>
              board._id === data.board._id ? data.board : board
            );
            return {
              ...prevUser,
              user: {
                ...prevUser.user,
                boards: updatedBoards,
              },
            };
          });
        } else {
          console.error("Received updated board data is missing an id");
        }
      }
    });

    // Listen for the "delete-board" event from the server
    socket.on('delete-board', (data) => {
      const currentUser = userRef.current;

      if (currentUser && currentUser.user._id === data.userID) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          const updatedBoards = prevUser.user.boards.filter(board => board._id !== data.boardID);

          // If no boards are left after deletion
          if (updatedBoards.length === 0) {
            changeBoard(null); // No active board if there are no boards
          } else {
            // If the active board was deleted, select another board
            if (activeBoardIndex >= updatedBoards.length) {
              changeBoard(updatedBoards.length - 1); // Switch to the last board if index is out of bounds
            } else {
              changeBoard(activeBoardIndex); // Keep the current active index if valid
            }
          }

          return {
            ...prevUser,
            user: {
              ...prevUser.user,
              boards: prevUser.user.boards.filter(board => board._id !== data.boardID), // Remove the deleted board
            },
          };
        });
      }
    });

    // Listen for the "new-task" event from the server
    socket.on('new-task', (data) => {
      const currentUser = userRef.current;

      if (currentUser && currentUser.user._id === data.userID) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          const updatedBoards = prevUser.user.boards.map(board => {
            if (board._id === data.boardID) {
              return {
                ...board,
                columns: board.columns.map((column: any) => {
                  if (column._id === data.columnID) {
                    // Check if task already exists to prevent duplication
                    const taskExists = column.tasks.some((task: any) => task._id === data.task._id);

                    // Only add the task if it doesn't already exist
                    if (!taskExists) {
                      return {
                        ...column,
                        tasks: [...column.tasks, data.task]
                      };
                    }
                  }
                  return column;
                })
              };
            }
            return board;
          });

          return {
            ...prevUser,
            user: {
              ...prevUser.user,
              boards: updatedBoards,
            },
          };
        });
      }
    });


    // Listen for the "delete-task" event from the server
    socket.on('delete-task', (data) => {
      const currentUser = userRef.current;

      if (currentUser && currentUser.user._id === data.userID) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          const updatedBoards = prevUser.user.boards.map(board => {
            if (board._id === data.boardID) {
              return {
                ...board,
                columns: board.columns.map((column: any) => {
                  if (column._id === data.columnID) {
                    return {
                      ...column,
                      tasks: column.tasks.filter((task: any) => task._id !== data.taskID)
                    };
                  }
                  return column;
                })
              };
            }
            return board;
          });

          return {
            ...prevUser,
            user: {
              ...prevUser.user,
              boards: updatedBoards,
            },
          };
        });
      }
    });

    // Listen for the "update-task" event from the server
    socket.on('update-task', (data) => {
      const currentUser = userRef.current;

      if (currentUser && currentUser.user._id === data.userID) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          const updatedBoards = prevUser.user.boards.map(board => {
            if (board._id === data.boardID) {
              return {
                ...board,
                columns: board.columns.map((column: any) => {
                  if (column._id === data.columnID) {
                    // Update the task if it exists in the column
                    const taskExists = column.tasks.some((task: any) => task._id === data.task._id);

                    if (taskExists) {
                      return {
                        ...column,
                        tasks: column.tasks.map((task: any) =>
                          task._id === data.task._id ? data.task : task
                        )
                      };
                    } else {
                      // Add the task to the column if it was moved
                      return {
                        ...column,
                        tasks: [...column.tasks, data.task]
                      };
                    }
                  }

                  // Remove the task from the old column if it was moved
                  return {
                    ...column,
                    tasks: column.tasks.filter((task: any) => task._id !== data.task._id),
                  };
                })
              };
            }
            return board;
          });

          return {
            ...prevUser,
            user: {
              ...prevUser.user,
              boards: updatedBoards,
            },
          };
        });
      }
    });



    // Clean up socket on unmount
    return () => {
      socket.off('new-board');
      socket.off('update-board');
      socket.off('delete-board');
      socket.off('new-task');
      socket.off('delete-task');
      socket.off('update-task');
    };
  }, [socket, activeBoardIndex, changeBoard]);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

