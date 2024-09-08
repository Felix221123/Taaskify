import './App.css';
import { BoardProvider } from './Context/Board/BoardContext';
import { ThemeProvider } from './Context/Theme/ThemeContext';
import { UserProvider } from './Context/User/UserContext';
import { AppRoute } from './Routes/AppRoute';

function App() {
  return (
    <>
      <BoardProvider>
        <UserProvider>
          <ThemeProvider>
            <AppRoute />
          </ThemeProvider>
        </UserProvider>
      </BoardProvider>
    </>
  );
}

export default App;
