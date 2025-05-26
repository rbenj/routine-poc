import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { Timer } from './Timer';

describe('Timer', () => {
  it('renders start button when not started', () => {
    render(<Timer durationSeconds={60} onComplete={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('starts timer when start button is clicked', () => {
    const onComplete = vi.fn();
    render(<Timer durationSeconds={60} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('auto-starts when autoStart is true', () => {
    const onComplete = vi.fn();
    render(<Timer autoStart durationSeconds={60} onComplete={onComplete} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('pauses and resumes timer', () => {
    const onComplete = vi.fn();
    render(<Timer autoStart durationSeconds={60} onComplete={onComplete} />);

    // Pause
    fireEvent.click(screen.getByRole('button', { name: 'Pause timer' }));
    expect(screen.getByText('1:00')).toBeInTheDocument();

    // Resume
    fireEvent.click(screen.getByRole('button', { name: 'Resume timer' }));
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('calls onComplete when timer is stopped', () => {
    const onComplete = vi.fn();
    render(<Timer autoStart durationSeconds={60} onComplete={onComplete} />);

    const stopButton = screen.getByRole('button', { name: 'Stop timer' });
    fireEvent.click(stopButton);

    expect(onComplete).toHaveBeenCalled();
    expect(screen.queryByText('1:00')).not.toBeInTheDocument();
  });
});
