import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { RestExecute } from './RestExecute';

// Mock the Timer component
vi.mock('@/components', () => ({
  Timer: ({ onComplete }: { onComplete: () => void }) => (
    <button onClick={onComplete}>Complete Timer</button>
  ),
}));

describe('RestExecute', () => {
  it('renders with required props', () => {
    render(
      <RestExecute
        durationSeconds={60}
        onClickContinue={vi.fn()}
      />,
    );

    expect(screen.getByText('Rest')).toBeInTheDocument();
    expect(screen.getByText('Complete Timer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <RestExecute
        className="custom-class"
        durationSeconds={60}
        onClickContinue={vi.fn()}
      />,
    );

    expect(screen.getByText('Rest').parentElement).toHaveClass('custom-class');
  });

  it('displays a random rest message', () => {
    render(
      <RestExecute
        durationSeconds={60}
        onClickContinue={vi.fn()}
      />,
    );

    const message = screen.getByText(/Stop doing stuff for a spell|Chill out for a bit|Relax, you've earned a break/);
    expect(message).toBeInTheDocument();
  });

  it('calls onClickContinue when timer completes', () => {
    const onClickContinue = vi.fn();
    render(
      <RestExecute
        durationSeconds={60}
        onClickContinue={onClickContinue}
      />,
    );

    // Simulate timer completion by clicking the mock timer's complete button
    fireEvent.click(screen.getByText('Complete Timer'));
    expect(onClickContinue).toHaveBeenCalled();
  });
});
