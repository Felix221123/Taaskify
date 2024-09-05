import React, { createContext, useEffect, useRef, useState } from 'react';
import { UserData } from '../../components/Interface/UserApiInterface';
import { FetchData } from '../../packages/FetchManager/fetchData';
import io from "socket.io-client"


export interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  // Create a reference to store the current user state
  const userRef = useRef<UserData | null>(null);

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

    // Clean up socket on unmount
    return () => {
      socket.off('new-board');
    };
  }, [socket]);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

