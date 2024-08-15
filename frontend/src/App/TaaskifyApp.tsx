import { EmptyColumn } from '../components/TaskColumn/EmptyColumn';
import { TaskColumn } from '../components/TaskColumn/TaskColumn';
import { Navbar } from '../components/Navbar/Navbar';
import './taaskifyStyles.css';
import { useTheme } from '../Context/UseTheme';
import React, { useEffect, useState } from 'react';

export const TaaskifyApp = () => {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);

  // useEffect to handle which board is currently active
  const handleBoardChange = (index: number) => {
    setActiveBoardIndex(index);
  };

  const boards = [
    {
      name: 'Platform Launch',
      columns: [
        {
          name: 'Todo',
          tasks: [
            {
              title: 'Build settings UI',
              description: 'here is the description for my first to do list',
              status: 'Todo',
              subtasks: [
                {
                  title: 'Account page',
                  isCompleted: false,
                },
                {
                  title: 'Billing page',
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Doing',
          tasks: [
            {
              title: 'Build settings UI',
              description: 'here is the description for my first to do list',
              status: 'Todo',
              subtasks: [
                {
                  title: 'Account page',
                  isCompleted: true,
                },
                {
                  title: 'Billing page',
                  isCompleted: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Doing',
          tasks: [
            {
              title: 'Build settings UI',
              description: 'here is the description for my first to do list',
              status: 'Todo',
              subtasks: [
                {
                  title: 'Account page',
                  isCompleted: true,
                },
                {
                  title: 'Billing page',
                  isCompleted: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Roadmap',
      columns: [
        {
          name: 'Todo',
          tasks: [
            {
              title: 'Build settings UI',
              description: 'here is the description for my first to do list',
              status: 'Todo',
              subtasks: [
                {
                  title: 'Account page',
                  isCompleted: false,
                },
                {
                  title: 'Billing page',
                  isCompleted: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const { theme } = useTheme();

  // changing the bg of the body element in the App
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === 'light' ? '#F4F7FD' : '#2B2C37';
  }, [theme]);

  // handles the bg color
  useEffect(() => {
    document.body.style.background = "rgb(0,14,36)";
    document.body.style.background = "linear-gradient(90deg, rgba(0,14,36,1) 4%, rgba(166,17,180,0.013064600840336116) 100%, rgba(0,212,255,1) 100%)";
  }, []);

  // theme to handle the new column container
  const handleBgTheme:React.CSSProperties = {
    background: theme === "dark" ? "linear-gradient(to bottom,rgba(43, 44, 55, 0.9) 0%,rgba(43, 44, 55, 0.5) 100%)" : "linear-gradient(to bottom,rgba(233, 239, 250, 1) 0%,rgba(233, 239, 250, 0.5) 100%)"
  }

  return (
    <>
      <Navbar boards={boards} onBoardChange={handleBoardChange} />
      <div
        className="taskColumnContainerWrap"
        data-testid="taskColumn"
      >
        {(boards.length > 0 &&
          boards[activeBoardIndex]?.columns.map((column, columnIndex) => (
            <TaskColumn
              key={`${activeBoardIndex}-${columnIndex}`}
              name={column?.name}
              tasks={column?.tasks}
            />
          ))) || <EmptyColumn />}
        {boards.length > 0 && (
          <div className="newColumnContainer rounded-lg cursor-pointer" style={handleBgTheme}>
            <button className='font-bold'>+ New Column</button>
          </div>
        )}

      </div>
    </>
  );
};
