import { ThemeProvider } from '../Context/ThemeContext';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { UserProvider } from '../Context/UserContext';
import { BoardProvider } from '../Context/BoardContext';

interface CustomRenderOptions extends RenderOptions {
  initialEntries?: string[];
  providerProps?: {
    value: {
      theme: string;
      toggleTheme: () => void;
    };
  };
}


// custom render to wrap the containers in the router provider element
export const customRender = (
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    providerProps = { value: { theme: 'light', toggleTheme: () => { } } },
    ...renderOptions
  }: CustomRenderOptions = {},
) => {
  return render(
    <UserProvider>
      <BoardProvider>
        <ThemeProvider {...providerProps}>
          <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
        </ThemeProvider>
      </BoardProvider>
    </UserProvider>,
    renderOptions
  );
};
