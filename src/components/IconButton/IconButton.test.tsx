import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with icon', () => {
    render(<IconButton icon={<span>🔔</span>} />);
    expect(screen.getByRole('button')).toContainHTML('<span>🔔</span>');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={<span>🔔</span>} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<IconButton icon={<span>🔔</span>} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
