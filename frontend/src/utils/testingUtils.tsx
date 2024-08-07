import { ThemeProvider } from '../Context/ThemeContext';
import { render ,RenderOptions} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'

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
    providerProps = { value: { theme: 'light', toggleTheme: () => {} } },
    ...renderOptions
  }: CustomRenderOptions = {},
) => {
  return render(
    <ThemeProvider {...providerProps}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </ThemeProvider>,
    renderOptions
  );
};
