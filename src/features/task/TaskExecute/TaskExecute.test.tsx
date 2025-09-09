import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { TaskExecute } from './TaskExecute';
import type { Field } from '@/models';

describe('TaskExecute', () => {
  const mockFields: Field[] = [
    {
      initialValueSource: 'memory' as const,
      maxValue: 100,
      minValue: 0,
      value: 50,
      defaultValue: 50,
      key: 'weight',
      name: 'weight',
      type: 'weight' as const,
    },
    {
      initialValueSource: 'default' as const,
      maxValue: 20,
      minValue: 0,
      value: 10,
      defaultValue: 10,
      key: 'reps',
      name: 'reps',
      type: 'int' as const,
    },
  ];

  it('renders with required props', () => {
    render(
      <TaskExecute
        endFields={[]}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={vi.fn()}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={vi.fn()}
        setNumber={1}
        timerDurationSeconds={60}
      />,
    );

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Set')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('weight')).toBeInTheDocument();
    expect(screen.getByText('reps')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TaskExecute
        className="custom-class"
        endFields={[]}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={vi.fn()}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={vi.fn()}
        setNumber={1}
        timerDurationSeconds={60}
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onChangeFieldValue when field value is changed', () => {
    const onChangeFieldValue = vi.fn();
    render(
      <TaskExecute
        endFields={[]}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={onChangeFieldValue}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={vi.fn()}
        setNumber={1}
        timerDurationSeconds={60}
      />,
    );

    // Click the edit button for the weight field
    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);

    // Click the increment button (first button in the overlay)
    const incrementButton = screen.getAllByRole('button')[1];
    fireEvent.click(incrementButton);

    // Click the close button (last button in the overlay)
    const closeButton = screen.getAllByRole('button')[3];
    fireEvent.click(closeButton);

    expect(onChangeFieldValue).toHaveBeenCalledWith(mockFields[0], 51);
  });

  it('calls onClickContinue when timer completes', () => {
    const onClickContinue = vi.fn();
    render(
      <TaskExecute
        endFields={[]}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={vi.fn()}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={onClickContinue}
        setNumber={1}
        timerDurationSeconds={60}
      />,
    );

    // Simulate timer completion
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop timer' }));

    // Click continue button that appears after timer completion
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onClickContinue).toHaveBeenCalled();
  });

  it('shows endFields only when timer is done', () => {
    const mockEndFields: Field[] = [
      {
        initialValueSource: 'memory' as const,
        maxValue: 10,
        minValue: 1,
        value: 5,
        defaultValue: 5,
        key: 'rpe',
        name: 'RPE',
        type: 'rpe' as const,
      },
    ];

    const { rerender } = render(
      <TaskExecute
        endFields={mockEndFields}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={vi.fn()}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={vi.fn()}
        setNumber={1}
        timerDurationSeconds={60}
      />,
    );

    // End fields should not be visible when timer is running
    expect(screen.queryByText('Check In')).not.toBeInTheDocument();

    // Rerender with timer completed
    rerender(
      <TaskExecute
        endFields={mockEndFields}
        estimatedSeconds={60}
        fields={mockFields}
        name="Bench Press"
        onChangeFieldValue={vi.fn()}
        onChangeEndFieldValue={vi.fn()}
        onClickContinue={vi.fn()}
        setNumber={1}
        timerDurationSeconds={0} // No timer
      />,
    );

    // End fields should be visible when no timer
    expect(screen.getByText('Check In')).toBeInTheDocument();
  });
});
