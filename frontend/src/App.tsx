import './App.css';
import { ThemeProvider } from './Context/ThemeContext';
import { AppRoute } from './Routes/AppRoute';

function App() {
  return (
    <>
      <ThemeProvider>
        <AppRoute />
      </ThemeProvider>
    </>
  );
}

export default App;
