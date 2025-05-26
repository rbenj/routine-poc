import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { TaskQueue } from './TaskQueue';
import type { Field } from '@/models';

describe('TaskQueue', () => {
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
      <TaskQueue
        fields={mockFields}
        name="Bench Press"
        setNumber={1}
      />,
    );

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Set 1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TaskQueue
        className="custom-class"
        fields={mockFields}
        name="Bench Press"
        setNumber={1}
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('formats field values correctly', () => {
    render(
      <TaskQueue
        fields={mockFields}
        name="Bench Press"
        setNumber={1}
      />,
    );

    expect(screen.getByText('50 lbs')).toBeInTheDocument();
  });

  it('renders nothing when setNumber is 0', () => {
    render(
      <TaskQueue
        fields={mockFields}
        name="Bench Press"
        setNumber={0}
      />,
    );

    expect(screen.queryByText('Set 0')).not.toBeInTheDocument();
  });

  it('renders nothing when fields is empty', () => {
    render(
      <TaskQueue
        fields={[]}
        name="Bench Press"
        setNumber={1}
      />,
    );

    expect(screen.queryByText('50 lbs')).not.toBeInTheDocument();
  });
});
