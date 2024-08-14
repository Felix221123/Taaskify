import ChevronDown from '/src/assets/icon-chevron-down.svg';
import ChevronUp from '/src/assets/icon-chevron-up.svg';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AddNewTask from '/src/assets/icon-add-task-mobile.svg';
import { EditDeleteContainer } from '../Containers/EditDeleteContainer';
import { EditBtn } from '../Buttons/EditBtn';
import './NavbarStyle.css';
import { useTheme } from '../../Context/UseTheme';
import EyeBtn from '/src/assets/icon-show-sidebar.svg';
import BoardImg from '/src/assets/icon-board.svg';
import HideSideImg from '/src/assets/icon-hide-sidebar.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleContainer } from '../Containers/ToggleContainer';
import { NavbarProps } from '../Interface/Boards';
import { AddNewTaskContainer } from '../Containers/AddNewTaskContainer';
import { AddNewBoard } from '../Containers/AddNewBoard';
import { DeleteContainer } from '../Containers/DeleteContainer';
import { EditBoardContainer } from '../Containers/EditBoardContainer';
import { SettingsContainer } from '../Containers/SettingsContainer';
import { ProfileContainer } from '../Containers/ProfileContainer';
import { Loading } from '../Containers/Loading';

export const Navbar: React.FC<NavbarProps> = ({ boards, onBoardChange }) => {
  const [menuVisibility, setMenuVisibility] = useState<boolean>(false);
  const [delEditVisible, setDelEditVisible] = useState<boolean>(false);
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [isHideSideBarHovered, setIsHideSideBarHovered] = useState<string>('');
  const [activeBoard, setActiveBoard] = useState<number>(0);
  const [addTaskBtn, setAddTaskBtn] = useState(false);
  const [addBoardBtn, setAddBoardBtn] = useState(false);
  const [editDelBoardCon, setEditDelBoardCon] = useState<string>('');
  const [profileVisibility, setProfileVisibility] = useState<boolean>(false);
  const [isLoggingOut, setLoggingOut] = useState<string>("");
  const menuBarContainer = useRef<HTMLDivElement>(null);
  const editDeleteContainer = useRef<HTMLDivElement>(null);
  const TaskContainers = useRef<HTMLDivElement>(null);
  const addNewBoardContainer = useRef<HTMLDivElement>(null);
  const EditDelContainer = useRef<HTMLDivElement>(null);
  const UserContainer = useRef<HTMLDivElement>(null);

  // useEffect to handle the active board
  useEffect(() => {
    onBoardChange(activeBoard);
  }, [activeBoard, onBoardChange]);

  // handles the visibility of the menu container
  const handleMenuVisibility = useCallback(() => {
    if (delEditVisible) {
      setDelEditVisible(false);
    }
    setMenuVisibility(true);
  }, [delEditVisible]);

  // handles the open visibility of the side bar
  const handleSideBarOpen = () => {
    setShowSideBar(true);
  };

  // handles the close visibility of the sidebar
  const handlesSideBarClose = () => {
    setShowSideBar(false);
  };

  // handles the close of the add to task container
  const handleCloseAddToTaskContainer = () => {
    setAddTaskBtn(false);
  }

  // handles the open of adding a new board
  const handlesAddBoardOnOpen = () => {
    setAddBoardBtn(true);
    setMenuVisibility(false);
  };

  // handles the edit / delete button
  const handleEditDelContainer = (button: string) => {
    setEditDelBoardCon(button);
    setDelEditVisible(false);
  };

  // function to handle the click on a board
  const handleBoardClick = (index: number) => {
    setActiveBoard(index);
    handlesSideBarClose();
  };

  // function to handle the click on a board on mobile
  const handleBoardClickOnMobile = (index: number) => {
    setActiveBoard(index);
    setMenuVisibility(false);
  };

  // handles the visibility of the delete edit container
  const handlesDelEditVisibility = () => {
    setDelEditVisible((previous) => !previous);
  };

  // using the theme from context
  const { theme } = useTheme();

  // title theme colors
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  // styles to match the headers bgColor when theme changes
  const handleBgTheme: React.CSSProperties = {
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#3E3F4E',
  };

  // animation for side bar
  const getMenuAnimationVariants = () => ({
    hidden: { left: -300, opacity: 0 },
    visible: { left: 0, opacity: 1 },
    exit: { left: -300, opacity: 0 },
  });

  // animations for navbar container on mobile
  const getMenuAnimationOnMobile = () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  });

  // hook to handle clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuVisibility &&
        menuBarContainer.current &&
        !menuBarContainer.current.contains(event.target as Node)
      ) {
        setMenuVisibility(false);
      } else if (
        delEditVisible &&
        editDeleteContainer.current &&
        !editDeleteContainer.current.contains(event.target as Node)
      ) {
        setDelEditVisible(false);
      } else if (
        addTaskBtn &&
        TaskContainers.current &&
        !TaskContainers.current.contains(event.target as Node)
      ) {
        setAddTaskBtn(false);
      } else if (
        addBoardBtn &&
        addNewBoardContainer.current &&
        !addNewBoardContainer.current.contains(event.target as Node)
      ) {
        setAddBoardBtn(false);
      } else if (
        editDelBoardCon !== '' &&
        EditDelContainer.current &&
        !EditDelContainer.current.contains(event.target as Node)
      ) {
        setEditDelBoardCon('');
      } else if (
        profileVisibility &&
        UserContainer.current &&
        !UserContainer.current.contains(event.target as Node)
      ) {
        setProfileVisibility(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    menuVisibility,
    delEditVisible,
    addTaskBtn,
    addBoardBtn,
    editDelBoardCon,
    profileVisibility,
  ]);

  // function to handle the hovering of a board
  const handleHovered = (index: number) => {
    setIsHovered(index);
  };

  // function to handle unHovered boards
  const handleUnHovered = () => {
    setIsHovered(null);
  };

  // function to handle the hovering of the hide side bar btn
  const handleSideBarHovered = (sidebar: string) => {
    setIsHideSideBarHovered(sidebar);
  };

  // function to handle unHovering of the hide side bar
  const handleSideBarUnHovered = () => {
    setIsHideSideBarHovered('');
  };

  // styling for when an element is hovered
  const HoveredStyle: React.CSSProperties = {
    width: '92%',
    backgroundColor: theme === 'light' ? 'rgba(99, 95, 199, 0.25)' : '#FFFFFF',
    borderRadius: '0rem 1.5rem 1.5rem 0rem',
    color: theme === 'dark' ? '#635FC7' : '#635FC7',
  };

  // styling for when an element is active
  const ActiveBoard: React.CSSProperties = {
    width: '92%',
    backgroundColor: '#635FC7',
    borderRadius: '0rem 1.5rem 1.5rem 0rem',
    color: '#FFFFFF',
  };

  // handling the click event of opening the addTask container
  const handleOpenAddTaskClick = () => {
    if (boards.length === 0) {
      setAddTaskBtn(false);
    } else {
      setAddTaskBtn(true);
    }
  };

  // function to handle opening user profile on settings button
  const handleOnOpenProfile = () => {
    setProfileVisibility(true);
    setMenuVisibility(false);
  };

  // handle the profile visibility when users press on logout
  const handleLoggingOut = (logout: string) => {
    setProfileVisibility(false);
    setLoggingOut(logout); // Immediately set the logging out state
    setTimeout(() => {
      // Perform any additional cleanup or navigation if needed
      setLoggingOut(''); // Optionally clear the logging out state after the delay
    }, 5000);
}

  return (
    <>
      {/* mobile first navbar design */}
      {
        <div className="mobileNavbarContainer" style={handleBgTheme}>
          <div className="leftHandSide">
            <article
              className="logo font-bold uppercase"
              data-testid="saasName"
            >
              taaskify
            </article>
            <div
              className="currentBoardContainer font-bold"
              onClick={handleMenuVisibility}
              style={TitleColorOnChange}
              data-testid="nameOfBoard"
            >
              <span className="title">{boards[activeBoard]?.name} </span>
              <img
                src={menuVisibility ? ChevronUp : ChevronDown}
                alt="arrow down and up"
                className="arrowChevron"
              />
            </div>
          </div>
          <div className="rightHandSide">
            <div
              className="addNewTaskBtn rounded-3xl"
              onClick={handleOpenAddTaskClick}
            >
              <img src={AddNewTask} alt="plus sign for add new task" />
            </div>
            <EditBtn
              onClickEditBtn={handlesDelEditVisibility}
              className="EditBtn"
            />
          </div>
        </div>
      }

      {/* container for edit and delete board */}
      {delEditVisible && (
        <div className="containerForDelEdit" data-testid="editDelContainer">
          <EditDeleteContainer
            containerName="board"
            ref={editDeleteContainer}
            onClickDeleteProp={() => handleEditDelContainer('delete')}
            onClickEditProp={() => handleEditDelContainer('edit')}
          />
        </div>
      )}

      {/* tablet and desktop design navbar container */}
      {
        <div className="navBarComp" style={handleBgTheme}>
          <div className="desktopLeftHandSide">
            <div
              className="appLogoCompany font-bold uppercase leading-6"
              data-testid="saasName"
            >
              taaskify
            </div>
            <div className="border"></div>
            <article
              className={
                showSideBar
                  ? 'ActivePage pushActiveBar font-bold'
                  : 'ActivePage font-bold'
              }
              style={TitleColorOnChange}
            >
              {boards[activeBoard]?.name}{' '}
            </article>
          </div>
          <div className="desktopRightHandSide">
            <button
              className="desktopAddNewTask font-bold"
              onClick={handleOpenAddTaskClick}
              data-testid="desktopAddNewTask"
            >
              + Add New Task
            </button>
            <EditBtn
              onClickEditBtn={handlesDelEditVisibility}
              className="EditBtn"
            />
          </div>
        </div>
      }

      {/* eye btn for sidebar visibility */}
      <div
        className="eyeBtn cursor-pointer"
        onClick={handleSideBarOpen}
        data-testid="eyeBtn"
      >
        <img src={EyeBtn} alt="eye button" />
      </div>

      {/* side bar on desktop container */}
      <AnimatePresence>
        {showSideBar && (
          <motion.div
            className="sideBarContainer"
            style={handleBgTheme}
            initial={getMenuAnimationVariants().hidden}
            animate={getMenuAnimationVariants().visible}
            exit={getMenuAnimationVariants().exit}
            transition={{ duration: 0.5 }}
            data-testid="sideBar"
          >
            <div className="upperSide">
              <div
                className="appLogoCompany font-bold uppercase leading-6"
                data-testid="saasName"
              >
                taaskify
              </div>

              <div className="allBoardsContainer">
                <article className="allBoards font-bold">
                  ALL BOARDS <span>({boards.length})</span>
                </article>
                <div className="boardCon">
                  {boards.map((board, index) => (
                    <div
                      className={`boardStyle font-bold cursor-pointer`}
                      key={index}
                      onClick={() => handleBoardClick(index)}
                      onMouseOver={() => handleHovered(index)}
                      onMouseLeave={handleUnHovered}
                      style={
                        activeBoard === index
                          ? ActiveBoard
                          : isHovered === index
                            ? HoveredStyle
                            : {}
                      }
                    >
                      <img src={BoardImg} alt="board image" />
                      {board.name}
                    </div>
                  ))}
                </div>
                <button
                  className="createMoreBoard cursor-pointer font-bold"
                  onClick={handlesAddBoardOnOpen}
                  data-testid="createMoreBoard"
                >
                  <img src={BoardImg} alt="board image" />
                  {'+ Create New Board'}
                </button>
              </div>
            </div>

            {/* toggle btn with hide side bar */}
            <div className="toggleHideContainer">
              <ToggleContainer />
              <SettingsContainer
                firstName="felix"
                lastName="baah"
                onClickProps={handleOnOpenProfile}
              />
              <div
                className={`hideSideBar font-bold cursor-pointer`}
                onClick={handlesSideBarClose}
                data-testid="hideBtn"
                onMouseOver={() => handleSideBarHovered('hideSide')}
                onMouseLeave={handleSideBarUnHovered}
                style={isHideSideBarHovered ? HoveredStyle : {}}
              >
                <img src={HideSideImg} alt="hideSideBar" />
                Hide Sidebar
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* navbar on mobile container */}
      <AnimatePresence>
        {menuVisibility && (
          <motion.div
            className="mobileContainerBar"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={menuBarContainer}
            style={handleBgTheme}
            data-testid="menuMobile"
          >
            <article className="font-bold">
              ALL BOARDS ({boards.length})
            </article>
            <div className="boardCon">
              {boards.map((board, index) => (
                <div
                  className={`boardStyle font-bold cursor-pointer`}
                  key={index}
                  onClick={() => handleBoardClickOnMobile(index)}
                  style={activeBoard === index ? ActiveBoard : {}}
                >
                  <img src={BoardImg} alt="board image" />
                  {board.name}
                </div>
              ))}
            </div>
            <button
              className="createMoreBoard cursor-pointer font-bold"
              onClick={handlesAddBoardOnOpen}
              data-testid="createMoreBoardForMobile"
            >
              <img src={BoardImg} alt="board image" />
              {'+ Create New Board'}
            </button>
            <ToggleContainer />
            <SettingsContainer
              firstName="felix"
              lastName="baah"
              onClickProps={handleOnOpenProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* calling the add task container */}
      <AnimatePresence>
        {addTaskBtn && (
          <motion.div
            className="containerOpen"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            data-testid="addTaskContainer"
            ref={TaskContainers}
          >
            <AddNewTaskContainer onCloseProp={handleCloseAddToTaskContainer}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* calling the add new board container */}
      <AnimatePresence>
        {addBoardBtn && (
          <motion.div
            className="containerOpenForBoard"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={addNewBoardContainer}
          >
            <AddNewBoard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* calling the delete board container */}
      <AnimatePresence>
        {editDelBoardCon === 'delete' && (
          <motion.div
            className="containerOpenForBoard"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={EditDelContainer}
          >
            <DeleteContainer
              deleteContainerName="board"
              deleteContainerItemName={boards[activeBoard]?.name}
              setEditDelBoardCon={setEditDelBoardCon}
            />
          </motion.div>
        )}
        {editDelBoardCon === 'edit' && (
          <motion.div
            className="containerOpenForBoard"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={EditDelContainer}
          >
            <EditBoardContainer boardName={boards[activeBoard]?.name} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* calling the profile container */}
      <AnimatePresence>
        {profileVisibility && (
          <motion.div
            className="containerOpenForProfile"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            ref={UserContainer}
          >
            <ProfileContainer
              firstName="felix"
              lastName="baah"
              emailAddress="felixbaah47@gmail.com"
              isLoggingOut={handleLoggingOut}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* calling the loading section */}
      <AnimatePresence>
        {isLoggingOut !== "" && (
          <motion.div
            className="containerOpenForProfile"
            initial={getMenuAnimationOnMobile().hidden}
            animate={getMenuAnimationOnMobile().visible}
            exit={getMenuAnimationOnMobile().exit}
            transition={{ duration: 0.5 }}
            data-testid="loadingSpin"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>


      {menuVisibility && <div id="overLayEffect"></div>}
      {delEditVisible && <div id="overLayEffect"></div>}
      {addTaskBtn && <div id="overLayEffect"></div>}
      {addBoardBtn && <div id="overLayEffect"></div>}
      {editDelBoardCon !== '' && <div id="overLayEffect"></div>}
      {profileVisibility && <div id="overLayEffect"></div>}
      {isLoggingOut !== "" && <div id="overLayEffect"></div>}
    </>
  );
};
