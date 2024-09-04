import React, { createContext, useState } from 'react';

// Create a context for the active board
export const BoardContext = createContext<any>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBoardIndex, setActiveBoardIndex] = useState<number>(0);

  const changeBoard = (index: number) => {
    setActiveBoardIndex(index);
  };


  return (
    <BoardContext.Provider value={{ activeBoardIndex, changeBoard }}>
      {children}
    </BoardContext.Provider>
  );
};
