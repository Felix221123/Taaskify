import React, { createContext, useEffect, useState } from 'react';
import { UserData } from '../../components/Interface/UserApiInterface';
import { FetchData } from '../../packages/FetchManager/fetchData';



export interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

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
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

