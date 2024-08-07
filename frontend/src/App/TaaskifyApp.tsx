import { EmptyColumn } from '../components/TaskColumn/EmptyColumn';
import { TaskColumn } from '../components/TaskColumn/TaskColumn';
import { Navbar } from '../components/Navbar/Navbar';
import './taaskifyStyles.css';
import { useTheme } from '../Context/UseTheme';
import { useEffect, useState } from 'react';

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

  return (
    <>
      <Navbar boards={boards} onBoardChange={handleBoardChange} />
      <div
        className="taskColumnContainerWrap flex flex-row items-center gap-x-4"
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
      </div>
    </>
  );
};
