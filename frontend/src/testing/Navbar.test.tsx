import { screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar/Navbar';
import AddNewTask from '/src/assets/icon-add-task-mobile.svg';
import { EditBtn } from '../components/Buttons/EditBtn';
import { EditDeleteContainer } from '../components/Containers/EditDeleteContainer';
import { ToggleContainer } from '../components/Containers/ToggleContainer';
import { customRender } from '../utils/testingUtils';
import { EditBoardContainer } from '../components/Containers/EditBoardContainer';
import { DeleteContainer } from '../components/Containers/DeleteContainer';
import { UpdatePassword } from '../Auth/UpdatePassword';
import { describe, it, expect , test} from 'vitest';

// Mock data for boards
const boards = [
  {
    name: 'Platform Launch',
    columns: [
      {
        name: 'Todo',
        tasks: [
          {
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
            _id: "1"
          },
        ],
        _id: "1"
      },
    ],
    _id: "1"
  },
];

// Wrapper component to manage state in tests
const NavbarTestWrapper = () => {

  const userData = {
    firstName: "felix",
    lastName: "baah",
    emailAddress: "felixbaah@gmail.com"
  }

  return <Navbar boards={boards} user={userData} />;
};


// testing the mobile first navbar design
describe('Navbar Mobile first Component', () => {
  it('it should display the name of the platform', () => {
    customRender(<NavbarTestWrapper />);
    const platformName = screen.getAllByTestId('saasName');
    expect(platformName).not.toHaveLength(0);
    platformName.forEach((each) => expect(each).toBeInTheDocument());
  });

  it('It should display the add new task button', () => {
    customRender(<NavbarTestWrapper />);
    const button = screen.getByAltText(/plus sign for add new task/i);
    expect(button).toHaveAttribute('src', AddNewTask);
    expect(button).toBeInTheDocument();
  });

  it('It should have the edit delete btn and when pressed, it should display the edit delete container', () => {
    // customRender(<Navbar />);
    customRender(<EditBtn />);
    const button = screen.getByTestId('editBtn');
    expect(button).toBeVisible();

    customRender(<NavbarTestWrapper />);
    customRender(<EditDeleteContainer containerName="board" />);
    fireEvent.click(button);
    expect(screen.getByTestId('editDeleteCon')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.getByTestId('editDeleteCon')).not.toBeVisible();
  });
});



// testing the side bar component in tablet and desktop design
describe('Side Bar Component(desktop and mobile)', () => {
  it('It should display the side bar on desktop when the eyeBtn is pressed and when clicked on the hideBtn it disappears', () => {
    customRender(<NavbarTestWrapper />);
    customRender(<ToggleContainer />);
    const eyeBtn = screen.getByTestId('eyeBtn');
    expect(eyeBtn).toBeVisible();
    expect(eyeBtn).toBeInTheDocument();

    fireEvent.click(eyeBtn);
    expect(screen.getByTestId('sideBar')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('hideBtn'));
    expect(screen.getByTestId('sideBar')).not.toBeVisible();
  });

  it('It should display the menu container when pressed on mobile and disappear when clicked outside the container', () => {
    customRender(<NavbarTestWrapper />);
    fireEvent.click(screen.getByTestId('nameOfBoard'));
    expect(screen.getByTestId('menuMobile')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.getByTestId('menuMobile')).not.toBeVisible();
  });

  test('it should display the update password from the profile session session when btn is clicked', () => {
    customRender(<NavbarTestWrapper />);
    customRender(<UpdatePassword />);

    const eyeBtn = screen.getByTestId('eyeBtn');
    expect(eyeBtn).toBeVisible();
    expect(eyeBtn).toBeInTheDocument();

    fireEvent.click(eyeBtn);
    expect(screen.getByTestId('sideBar')).toBeInTheDocument();

    const settingsIcon = screen.getByTestId("settingsIcon")

    fireEvent.click(settingsIcon);

    expect(screen.getByTestId("profileContainer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("custom-primary-button"));

    expect(screen.getByText(/Update Your Taaskify Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your current password and your new password/i)).toBeInTheDocument();

  })

});


// testing the rendering of the containers
describe('Renders the containers ', () => {
  it('it should display the add task container', () => {
    customRender(<NavbarTestWrapper />);
    fireEvent.click(screen.getByAltText('plus sign for add new task'));
    expect(screen.getByTestId('addTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('desktopAddNewTask'));
    expect(screen.getByTestId('addTaskContainer')).toBeInTheDocument();
  });

  it('it should display the add new board', () => {
    customRender(<NavbarTestWrapper />);
    customRender(<ToggleContainer />);
    const eyeBtn = screen.getByTestId('eyeBtn');
    expect(eyeBtn).toBeVisible();
    expect(eyeBtn).toBeInTheDocument();

    fireEvent.click(eyeBtn);
    expect(screen.getByTestId('sideBar')).toBeInTheDocument();

    const createMoreBoard = screen.getByTestId('createMoreBoard');
    fireEvent.click(createMoreBoard);
    expect(screen.getByTestId('addNewBoardContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('nameOfBoard'));
    expect(screen.getByTestId('menuMobile')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('createMoreBoardForMobile'));
    expect(screen.getByTestId('addNewBoardContainer')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.getByTestId('addNewBoardContainer')).not.toBeVisible();
  });


  it('it should display the edit container when edit btn is pressed', () => {
    customRender(<EditBtn />);
    const button = screen.getByTestId('editBtn');
    expect(button).toBeVisible();

    customRender(<NavbarTestWrapper />);
    customRender(<EditDeleteContainer containerName="board" />);
    customRender(<EditBoardContainer name="board" boardID='1' columns={[]} onCloseProp={() => {}}/>);
    fireEvent.click(button);
    expect(screen.getByTestId('editDeleteCon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn1'));
    expect(screen.getByTestId('editContainer')).toBeInTheDocument();
  });

  it('it should display the delete container when the delete btn is pressed', () => {
    customRender(<EditBtn />);
    const button = screen.getByTestId('editBtn');
    expect(button).toBeVisible();

    customRender(<NavbarTestWrapper />);
    customRender(<EditDeleteContainer containerName="board" />);
    customRender(<EditBoardContainer name="board" boardID='1' columns={[]} onCloseProp={() => {}}/>);
    customRender(
      <DeleteContainer
        deleteContainerItemName=""
        deleteContainerName=""
        setEditDelBoardCon={() => { }}
        boardID='1'
        columnID='1'
        taskID='1'
      />
    );
    fireEvent.click(button);
    expect(screen.getByTestId('editDeleteCon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn2'));
    expect(screen.getByTestId('deleteCon')).toBeInTheDocument();
  });

  test('it should remove the task container from the document when the close button is pressed', () => {
    customRender(<NavbarTestWrapper />);
    fireEvent.click(screen.getByAltText('plus sign for add new task'));
    expect(screen.getByTestId('addTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('desktopAddNewTask'));
    expect(screen.getByTestId('addTaskContainer')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("closeBtn"))

    expect(screen.getByTestId('addTaskContainer')).not.toBeVisible();
  })

});
