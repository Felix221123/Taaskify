import './App.css';
import { BoardProvider } from './Context/BoardContext';
import { ThemeProvider } from './Context/ThemeContext';
import { UserProvider } from './Context/UserContext';
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
