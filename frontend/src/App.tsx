import './App.css';
import { BoardProvider } from './Context/Board/BoardContext';
import { ThemeProvider } from './Context/Theme/ThemeContext';
import { UserProvider } from './Context/User/UserContext';
import { AppRoute } from './Routes/AppRoute';

function App() {
  return (
    <>
      <UserProvider>
        <BoardProvider>
          <ThemeProvider>
            <AppRoute />
          </ThemeProvider>
        </BoardProvider>
      </UserProvider>
    </>
  );
}

export default App;
