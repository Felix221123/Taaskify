import './App.css';
import { TaaskifyApp } from './App/TaaskifyApp';
import { ThemeProvider } from './Context/ThemeContext';

function App() {
  return (
    <>
      <ThemeProvider>
        <TaaskifyApp />
      </ThemeProvider>
    </>
  );
}

export default App;
