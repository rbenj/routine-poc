import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { Overlay } from './Overlay';

describe('Overlay', () => {
  it('renders children', () => {
    render(
      <Overlay onClose={vi.fn()}>
        <div>Test Content</div>
      </Overlay>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Overlay onClose={onClose}>
        <div>Test Content</div>
      </Overlay>,
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when background is clicked', () => {
    const onClose = vi.fn();
    render(
      <Overlay onClose={onClose}>
        <div>Test Content</div>
      </Overlay>,
    );

    const overlay = screen.getByText('Test Content').parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when inner content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Overlay onClose={onClose}>
        <div>Test Content</div>
      </Overlay>,
    );

    const content = screen.getByText('Test Content');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Overlay className="custom-class" onClose={vi.fn()}>
        <div>Test Content</div>
      </Overlay>,
    );

    const overlay = screen.getByText('Test Content').parentElement?.parentElement;
    expect(overlay).toHaveClass('custom-class');
  });
});
