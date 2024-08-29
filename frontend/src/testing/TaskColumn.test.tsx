import { screen , fireEvent} from '@testing-library/react';
import { customRender } from '../utils/testingUtils';
import { TaskColumn } from '../components/TaskColumn/TaskColumn';

describe('Task Column Component', () => {
  it('it should display the task name and it counts', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "In Progress",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);


    // circle is displayed
    expect(screen.getByTestId('colorCircle')).toBeInTheDocument();
    expect(screen.getByTestId('colorCircle')).toBeVisible();

    // taskName here
    expect(screen.getByTestId('taskName')).toHaveTextContent(/Column 1/i);

    // task count
    expect(screen.getByTestId('taskCount')).toHaveTextContent(/(1)/i);
  });

  it('it should display the task Container Component', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "platform",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);


    // task Title
    expect(screen.getByTestId('taskTitle')).toHaveTextContent(
      /Task 1/i
    );
    expect(screen.getByTestId('taskTitle')).toBeInTheDocument();
    expect(screen.getByTestId('taskTitle')).toBeVisible();

    // subtask to be visible
    expect(screen.getByTestId('subTaskCount')).toBeVisible();
  });

  test('it should render the view container when clicked ', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "platform",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);

    // Click on the task
    fireEvent.click(screen.getByText('Task 1'));

    // Check if the view container is displayed
    expect(screen.getByTestId('viewTaskContainer')).toBeInTheDocument();

  })

  test('it should display the edit task container when the edit btn is clicked and also be removed when clicked outside container', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "platform",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);


    // Click on the task
    fireEvent.click(screen.getByText('Task 1'));

    // Check if the view container is displayed
    expect(screen.getByTestId('viewTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("editBtn"))

    expect(screen.getByTestId("editDeleteCon")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("btn1"))

    expect(screen.getByTestId("editTaskContainer")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.getByTestId("editTaskContainer")).not.toBeVisible();
  });

  test('it should display the delete container when the delete task btn is clicked and also be removed when clicked outside container', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "platform",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);


    // Click on the task
    fireEvent.click(screen.getByText('Task 1'));

    // Check if the view container is displayed
    expect(screen.getByTestId('viewTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("editBtn"))

    expect(screen.getByTestId("editDeleteCon")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn2"))

    expect(screen.getByTestId("deleteTaskContainer")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.getByTestId("deleteTaskContainer")).not.toBeVisible();
  })

  test('it should remove the edit task container when the close button is pressed', () => {
    const tasks = [
      {
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        subtasks: [{ title: 'Subtask 1', isCompleted: false }],
        _id: "1"
      },
    ];

    const boards = [
      {
        name: "firstBoard",
        columns: [
          {
            name: "platform",
            tasks: tasks,  // Reference the tasks array correctly
            _id: "1"
          }
        ],
        _id: '1'
      }
    ];

    customRender(<TaskColumn name="Column 1" tasks={tasks} boards={boards} columnID='1' />);


    // Click on the task
    fireEvent.click(screen.getByText('Task 1'));

    // Check if the view container is displayed
    expect(screen.getByTestId('viewTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("editBtn"))

    expect(screen.getByTestId("editDeleteCon")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("btn1"))

    expect(screen.getByTestId("editTaskContainer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("closeBtn"));

    expect(screen.getByTestId("editTaskContainer")).not.toBeVisible();
  })


});
