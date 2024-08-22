import '@testing-library/jest-dom';
import { vi } from "vitest"

vi.mock('../packages/FetchManager/fetchData', () => ({
  FetchData: vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test User' }),
  })),
}));
