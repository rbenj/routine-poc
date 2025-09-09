import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests';
import { PlanLayout } from './PlanLayout';
import { usePlan, usePlanFields } from '@/features/plan';
import { Plan } from '@/models';
import { DayOfWeek } from '@/types';

// Mock the hooks
vi.mock('@/features/plan', () => ({
  usePlan: vi.fn(),
  usePlanFields: vi.fn(),
  PlanHeader: vi.fn(({ name }) => (
    <div data-testid="plan-header">
      {name}
    </div>
  )),
}));

// Mock the task and rest components
vi.mock('@/features/task', () => ({
  TaskCard: vi.fn(({ name, setNumber }) => (
    <div data-testid="task-card">
      {name}
      {' '}
      (Set
      {' '}
      {setNumber}
      )
    </div>
  )),
}));

vi.mock('@/features/rest', () => ({
  RestCard: vi.fn(({ durationSeconds }) => (
    <div data-testid="rest-card">
      Rest (
      {durationSeconds}
      s)
    </div>
  )),
}));

describe('PlanLayout', () => {
  const mockPlan = new Plan({
    name: 'Test Plan',
    items: [
      {
        type: 'task',
        key: 'task1',
        name: 'Bench Press',
        estimatedSeconds: 60,
        set: 1,
        fields: [],
      },
      {
        type: 'rest',
        durationSeconds: 30,
      },
      {
        type: 'task',
        key: 'task2',
        name: 'Bench Press',
        estimatedSeconds: 60,
        set: 2,
        fields: [],
      },
    ],
    assignment: [{ dayOfWeek: DayOfWeek.Monday, order: 1 }],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlan).mockReturnValue(mockPlan);

    // Create mock functions
    const mockGetTaskFields = vi.fn().mockReturnValue([]);
    const mockGetTaskEndFields = vi.fn().mockReturnValue([]);
    const mockSetTaskFieldValue = vi.fn();
    const mockSetTaskEndFieldValue = vi.fn();

    vi.mocked(usePlanFields).mockReturnValue({
      getTaskFields: mockGetTaskFields,
      getTaskEndFields: mockGetTaskEndFields,
      setTaskFieldValue: mockSetTaskFieldValue,
      setTaskEndFieldValue: mockSetTaskEndFieldValue,
    });
  });

  it('renders 404 when plan is not found', () => {
    vi.mocked(usePlan).mockReturnValue(undefined);

    render(<PlanLayout />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders plan header with plan name', () => {
    render(<PlanLayout />);

    expect(screen.getByTestId('plan-header')).toHaveTextContent('Test Plan');
  });

  it('renders task cards with correct set numbers', () => {
    render(<PlanLayout />);

    const taskCards = screen.getAllByTestId('task-card');
    expect(taskCards).toHaveLength(2);
    expect(taskCards[0]).toHaveTextContent('Bench Press (Set 1)');
    expect(taskCards[1]).toHaveTextContent('Bench Press (Set 2)');
  });

  it('renders rest card with duration', () => {
    render(<PlanLayout />);

    const restCard = screen.getByTestId('rest-card');
    expect(restCard).toHaveTextContent('Rest (30s)');
  });
});
