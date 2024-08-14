import { screen, fireEvent } from '@testing-library/react';
import { DeleteContainer } from '../components/Containers/DeleteContainer';
import { EditBoardContainer } from '../components/Containers/EditBoardContainer';
import { BoardColumnContainer } from '../components/Containers/EditBoardContainer';
import { AddNewBoard } from '../components/Containers/AddNewBoard';
import {
  AddNewTaskContainer,
  SubTaskAddNewTaskColumnContainer,
} from '../components/Containers/AddNewTaskContainer';
import { EditDeleteContainer } from '../components/Containers/EditDeleteContainer';
import {
  SubTaskForTaskContainer,
  ViewTaskContainer,
} from '../components/Containers/ViewTaskContainer';
import { customRender } from '../utils/testingUtils';
import { useState } from 'react';
import { Task } from '../components/Interface/AddTaskInterface';
import { SettingsContainer } from '../components/Containers/SettingsContainer';

export const SubtaskWrapper: React.FC<{ container: string }> = ({
  container,
}) => {
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    status: 'Todo',
    subtasks: [
      { title: '', isCompleted: false },
      { title: '', isCompleted: false },
    ],
  });

  return (
    <>
      {container === 'SubTaskAddNewTaskColumnContainer' ? (
        <SubTaskAddNewTaskColumnContainer
          subtasks={task.subtasks}
          setSubtasks={(newSubtasks) =>
            setTask({ ...task, subtasks: newSubtasks })
          }
        />
      ) : container === 'SubTaskForTaskContainer' ? (
        <SubTaskForTaskContainer
          subtasks={task.subtasks}
          setSubtasks={(newSubtasks) =>
            setTask({ ...task, subtasks: newSubtasks })
          }
        />
      ) : null}
    </>
  );
};

// testing the delete container component
describe('Delete Component', () => {
  it('it should display the heading in the document', () => {
    customRender(
      <DeleteContainer
        deleteContainerItemName="my lunch"
        deleteContainerName="task"
        setEditDelBoardCon={() => {}}
      />
    );
    const heading = screen.getByText(/Delete this task/i);
    expect(heading).toBeVisible();
    expect(heading).toBeInTheDocument();
  });

  it('It should display  the paragraph', () => {
    customRender(
      <DeleteContainer
        deleteContainerItemName="my lunch"
        deleteContainerName="task"
        setEditDelBoardCon={() => {}}
      />
    );
    const text = `Are you sure you want to delete the 'my lunch' task and its subtasks? This action cannot be reversed.`;
    const paragraph = screen.getByText(text);
    expect(paragraph).toBeVisible();
  });

  it('it should display the button with the button name', () => {
    customRender(
      <DeleteContainer
        deleteContainerItemName="my lunch"
        deleteContainerName="task"
        setEditDelBoardCon={() => {}}
      />
    );

    const button = screen.getAllByRole('button');
    expect(button).toHaveLength(2);
    expect(button[0]).toHaveTextContent('Delete');
    expect(button[1]).toHaveTextContent('Cancel');
  });
});

// testing the edit container component
describe('Edit Board Component', () => {
  it('It should display the heading of the container', () => {
    customRender(<EditBoardContainer boardName="My Task" />);
    const header = screen.getByText(/Edit Board/i);
    expect(header).toBeVisible();
    expect(header).toBeInTheDocument();
  });

  it('It should display the name of the name and the text in the input', () => {
    customRender(<EditBoardContainer boardName="My Task" />);
    const label = screen.getByText(/Board Name/i);
    expect(label).toBeVisible();
    expect(label).toBeInTheDocument();
  });

  test('should render the input element with the correct initial value', () => {
    customRender(<EditBoardContainer boardName="Initial Board Name" />);
    const inputElement = screen.getByRole('textbox', { name: /Board Name/i });
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('Initial Board Name');
  });

  it('it should update the value in the input based on the users type', () => {
    customRender(<EditBoardContainer boardName="" />);
    const inputElement = screen.getByRole('textbox', { name: /Board Name/i });
    fireEvent.change(inputElement, { target: { value: 'New Board Name' } });
    expect(inputElement).toHaveValue('New Board Name');
  });

  it('It should display the board columns with the input change and image', () => {
    const toggleTheme = vi.fn();
    const providerProps = {
      value: { theme: 'light', toggleTheme: toggleTheme() },
    };
    // customRender(<EditBoardContainer boardName="task" />);
    customRender(<BoardColumnContainer />, { providerProps });

    // const heading = /Board Columns/i;
    const heading = screen.getByText(/Board Columns/i);
    expect(heading).toBeVisible();
    expect(heading).toBeInTheDocument();

    // Initially, no columns should be present
    expect(screen.queryAllByRole('textbox').length).toBe(0);

    // Add a new column works as usual
  });
});

// testing the add new board container component
describe('Add New Board Container Component', () => {
  it('it should display the heading of the container', () => {
    customRender(<AddNewBoard />);
    const heading = screen.getByText(/Add New Board/i);
    expect(heading).toBeVisible();
    expect(heading).toBeInTheDocument();
  });

  it('it should display the name of the label with the value of the name of the board', () => {
    customRender(<AddNewBoard />);
    const labelText = screen.getByLabelText(/Board Name/i);
    expect(labelText).toBeInTheDocument();
  });

  it('it should display the save changes button', () => {
    customRender(<AddNewBoard />);
    const button = screen.getByRole('button', { name: /Save Changes/i });
    expect(button).toBeVisible();
  });
});

// testing the add new task container component
describe('Add New Task Container Component', () => {
  it('It should display the header, title, description', () => {
    customRender(<AddNewTaskContainer onCloseProp={() => {}}/>);
    const header = screen.getByText(/Add New Task/i);
    expect(header).toBeVisible();
    expect(header).toBeInTheDocument();

    const label = screen.getByLabelText(/Title/i);
    expect(label).toBeVisible();
    expect(label).toBeInTheDocument();
  });

  it('it should display the users input on the task title', () => {
    customRender(<AddNewTaskContainer onCloseProp={() => {}}/>);
    const inputElement = screen.getByRole('textbox', { name: /Title/i });
    fireEvent.change(inputElement, { target: { value: 'New Board Name' } });
    expect(inputElement).toHaveValue('New Board Name');

    const label = screen.getByLabelText(/Description/i);
    expect(label).toBeVisible();
    expect(label).toBeInTheDocument();

    const textAreaElement = screen.getByRole('textbox', {
      name: /Description/i,
    });
    fireEvent.change(textAreaElement, { target: { value: 'New Board Name' } });
    expect(textAreaElement).toHaveValue('New Board Name');
  });

  it('it should display board columns title with the columns', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );
    const paragraph = screen.getByText(/Subtasks/i);
    expect(paragraph).toBeVisible();
    expect(paragraph).toBeInTheDocument();
  });
});

describe('SubTaskColumnContainer task component', () => {
  test('renders the initial columns', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );

    // Check if the initial two columns are rendered with correct placeholders
    expect(screen.getByPlaceholderText('e.g. Make coffee')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Drink coffee & smile')
    ).toBeInTheDocument();
  });

  test('adds a new column when the button is clicked', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );

    const addButton = screen.getByTestId('custom-secondary-button');
    fireEvent.click(addButton);
    // Check if the new column is added with the correct placeholder
    expect(screen.getByPlaceholderText('e.g. Sample Text')).toBeInTheDocument();
  });

  test('calls handleColumnChange on input change', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );

    const firstInput = screen.getByPlaceholderText(
      'e.g. Make coffee'
    ) as HTMLInputElement;
    fireEvent.change(firstInput, { target: { value: 'New Task' } });

    expect(firstInput.value).toBe('New Task');
  });

  test('does not remove the first two columns', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );

    const firstCrossIcon = screen.getAllByTestId('removeIcon')[0];
    fireEvent.click(firstCrossIcon);

    // Check if the first two columns are still present
    expect(screen.getByPlaceholderText('e.g. Make coffee')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Drink coffee & smile')
    ).toBeInTheDocument();
  });

  test('removes a column when the cross icon is clicked', () => {
    customRender(
      <SubtaskWrapper container="SubTaskAddNewTaskColumnContainer" />
    );

    const addButton = screen.getByTestId('custom-secondary-button');
    fireEvent.click(addButton); // Add a new column

    const crossIcons = screen.getAllByTestId('removeIcon');
    fireEvent.click(crossIcons[2]); // Remove the newly added column

    // Check if the new column is removed
    expect(
      screen.queryByPlaceholderText('e.g. Sample Text')
    ).not.toBeInTheDocument();
  });
});

// testing the edit / delete container component
describe('Edit Delete container', () => {
  it('it should display the edit and the delete test and it should be clickable ', () => {
    customRender(<EditDeleteContainer containerName="task" />);

    const button1 = screen.getByTestId('btn1');
    expect(button1).toBeInTheDocument();
    // expect(button1).toBeInTheDocument();

    const button2 = screen.getByTestId('btn2');
    expect(button2).toBeInTheDocument();
  });
});

// testing the task Container component
describe('Task Container Component', () => {
  it('it should display the edit delete container when the edit btn is clicked', () => {
    const task = {
      title: 'Build settings UI',
      description: '',
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
    };
    customRender(
      <ViewTaskContainer
        title={task.title}
        description={task.description}
        status={task.status}
        subtasks={task.subtasks}
        ontoggleDelete={() => {}}
        ontoggleEdit={() => {}}
      />
    );
    const editBtn = screen.getByTestId('editBtn');
    fireEvent.click(editBtn);

    const container = screen.getByTestId('editDeleteCon');
    expect(container).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(container).not.toBeInTheDocument();
  });

  it('it should check the completed task', () => {
    customRender(<SubtaskWrapper container="SubTaskForTaskContainer" />);
    expect(screen.getByTestId('subtaskContainer')).toBeInTheDocument();
    expect(screen.getByTestId('subtaskContainer')).toBeVisible();
  });
});

// testing the profile container
describe('Profile Container', () => {
  it('it should display the users characters in the circle and the settings icon', () => {
    customRender(
      <SettingsContainer
        firstName="felix"
        lastName="baah"
        onClickProps={() => {}}
      />
    );
    expect(screen.getByTestId('avatarCircle')).toBeInTheDocument();
    expect(screen.getByTestId('avatarCircle')).toBeVisible();
    expect(screen.getByTestId('settingsIcon')).toBeInTheDocument();
    expect(screen.getByTestId('settingsIcon')).toBeVisible();
  });
});
