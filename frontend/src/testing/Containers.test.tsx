import { screen, fireEvent } from '@testing-library/react';
import { DeleteContainer } from '../components/Containers/DeleteContainer';
import { EditBoardContainer } from '../components/Containers/EditBoardContainer';
import { AddNewBoard } from '../components/Containers/AddNewBoard';
import {
  AddNewTaskContainer,
} from '../components/Containers/AddNewTaskContainer';
import { EditDeleteContainer } from '../components/Containers/EditDeleteContainer';
import {
  ViewTaskContainer,
} from '../components/Containers/ViewTaskContainer';
import { customRender } from '../utils/testingUtils';
import { SettingsContainer } from '../components/Containers/SettingsContainer';
import { describe, it, expect , test} from 'vitest';




// testing the delete container component
describe('Delete Component', () => {
  it('it should display the heading in the document', () => {
    customRender(
      <DeleteContainer
        deleteContainerItemName="my lunch"
        deleteContainerName="task"
        setEditDelBoardCon={() => {}}
        boardID='1'
        columnID='1'
        taskID='1'
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
        boardID='1'
        columnID='1'
        taskID='1'
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
        boardID='1'
        columnID='1'
        taskID='1'
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
    customRender(<EditBoardContainer name="board" boardID='1' columns={[]} onCloseProp={() => {}} />);
    const header = screen.getByText(/Edit Board/i);
    expect(header).toBeVisible();
    expect(header).toBeInTheDocument();
  });

  it('It should display the name of the name and the text in the input', () => {
    customRender(<EditBoardContainer name="board" boardID='1' columns={[]} onCloseProp={() => {}}/>);
    const label = screen.getByText(/Board Name/i);
    expect(label).toBeVisible();
    expect(label).toBeInTheDocument();
  });

  test('should render the input element with the correct initial value', () => {
    customRender(<EditBoardContainer name="Initial Board Name" boardID='1' columns={[]} onCloseProp={() => {}}/>);
    const inputElement = screen.getByRole('textbox', { name: /Board Name/i });
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('Initial Board Name');
  });

  it('it should update the value in the input based on the users type', () => {
    customRender(<EditBoardContainer name="" boardID='1' columns={[]} onCloseProp={() => {}}/>);
    const inputElement = screen.getByRole('textbox', { name: /Board Name/i });
    fireEvent.change(inputElement, { target: { value: 'New Board Name' } });
    expect(inputElement).toHaveValue('New Board Name');
  });

});



// testing the add new board container component
describe('Add New Board Container Component', () => {
  it('it should display the heading of the container', () => {
    customRender(<AddNewBoard onCloseContainer={() => {}}/>);
    const heading = screen.getByText(/Add New Board/i);
    expect(heading).toBeVisible();
    expect(heading).toBeInTheDocument();
  });

  it('it should display the name of the label with the value of the name of the board', () => {
    customRender(<AddNewBoard onCloseContainer={() => {}}/>);
    const labelText = screen.getByLabelText(/Board Name/i);
    expect(labelText).toBeInTheDocument();
  });

  it('it should display the save changes button', () => {
    customRender(<AddNewBoard onCloseContainer={() => {}}/>);
    const button = screen.getByRole('button', { name: /create new board/i });
    expect(button).toBeVisible();
  });
});

// testing the add new task container component
describe('Add New Task Container Component', () => {
  it('It should display the header, title, description', () => {
    customRender(<AddNewTaskContainer onCloseProp={() => {}} boardID='6Adfdef3294724' columns={[{id:"1", name:"Todo"}]}/>);
    const header = screen.getByText(/Add New Task/i);
    expect(header).toBeVisible();
    expect(header).toBeInTheDocument();

    const label = screen.getByLabelText(/Title/i);
    expect(label).toBeVisible();
    expect(label).toBeInTheDocument();
  });

  it('it should display the users input on the task title', () => {
    customRender(<AddNewTaskContainer onCloseProp={() => {}} boardID='6Adfdef3294724' columns={[{id:"1", name:"Todo"}]}/>);
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
        columns={[]}
        boardID='1'
        columnID='1'
        taskID='1'
      />
    );
    const editBtn = screen.getByTestId('editBtn');
    fireEvent.click(editBtn);

    const container = screen.getByTestId('editDeleteCon');
    expect(container).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(container).not.toBeInTheDocument();
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
