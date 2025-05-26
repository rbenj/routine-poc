import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { AdjustNumber } from './AdjustNumber';

describe('AdjustNumber', () => {
  it('renders with initial value and unit label', () => {
    render(<AdjustNumber value={5} unitLabel="minutes" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByText('minutes')).toBeInTheDocument();
  });

  it('increments value when up button is clicked', () => {
    const onChange = vi.fn();
    render(<AdjustNumber value={5} unitLabel="minutes" onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements value when down button is clicked', () => {
    const onChange = vi.fn();
    render(<AdjustNumber value={5} unitLabel="minutes" onChange={onChange} />);

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('respects max value', () => {
    const onChange = vi.fn();
    render(
      <AdjustNumber
        value={5}
        max={5}
        unitLabel="minutes"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('respects min value', () => {
    const onChange = vi.fn();
    render(
      <AdjustNumber
        value={0}
        min={0}
        unitLabel="minutes"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('handles direct input', () => {
    const onChange = vi.fn();
    render(<AdjustNumber value={5} unitLabel="minutes" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '10' } });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('handles empty input', () => {
    const onChange = vi.fn();
    render(<AdjustNumber value={5} unitLabel="minutes" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
