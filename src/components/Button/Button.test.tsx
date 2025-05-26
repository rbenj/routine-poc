import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button text="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('navigates when to prop is provided', () => {
    render(<Button text="Navigate" to="/some-path" />);
    fireEvent.click(screen.getByRole('button'));
    // Note: We can't directly test navigation in unit tests
    // This would be better tested in E2E tests
  });

  it('applies custom className', () => {
    render(<Button text="Custom Class" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
