import type { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  ),
  ...options,
});

export {
  customRender as render,
  screen,
  fireEvent,
};
