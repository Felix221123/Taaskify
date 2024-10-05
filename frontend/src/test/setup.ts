import '@testing-library/jest-dom';
import { vi, beforeAll } from "vitest"


vi.mock('../packages/FetchManager/fetchData', () => ({
  FetchData: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test User' }),
  })),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
