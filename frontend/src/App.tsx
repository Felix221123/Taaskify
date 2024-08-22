import './App.css';
import { ThemeProvider } from './Context/ThemeContext';
import { UserProvider } from './Context/UserContext';
import { AppRoute } from './Routes/AppRoute';

function App() {
  return (
    <>
      <UserProvider>
        <ThemeProvider>
          <AppRoute />
        </ThemeProvider>
      </UserProvider>
    </>
  );
}

export default App;
