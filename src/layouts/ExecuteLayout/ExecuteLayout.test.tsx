import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { ExecuteLayout } from './ExecuteLayout';
import { usePlan, usePlanFields } from '@/features/plan';
import { Plan } from '@/models';
import { DayOfWeek } from '@/types';

// Mock the plan completion service
vi.mock('@/services/planCompletion', () => ({
  setPlanCompletionDate: vi.fn(),
}));

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
  TaskExecute: vi.fn(({ name, setNumber, onClickContinue }) => (
    <div data-testid="task-execute">
      {name}
      {' '}
      (Set
      {' '}
      {setNumber}
      )
      <button onClick={onClickContinue}>Continue</button>
    </div>
  )),
  TaskQueue: vi.fn(({ name, fields }) => (
    <div data-testid="task-queue">
      {name}
      {' '}
      (
      {fields.length}
      {' '}
      fields)
    </div>
  )),
}));

vi.mock('@/features/rest', () => ({
  RestExecute: vi.fn(({ durationSeconds, onClickContinue }) => (
    <div data-testid="rest-execute">
      Rest (
      {durationSeconds}
      s)
      <button onClick={onClickContinue}>Continue</button>
    </div>
  )),
}));

describe('ExecuteLayout', () => {
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

    render(<ExecuteLayout />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders first task initially', () => {
    render(<ExecuteLayout />);

    const taskExecute = screen.getByTestId('task-execute');
    expect(taskExecute).toHaveTextContent('Bench Press (Set 1)');
  });

  it('progresses to rest after completing first task', () => {
    render(<ExecuteLayout />);

    // Complete first task
    fireEvent.click(screen.getByText('Continue'));

    const restExecute = screen.getByTestId('rest-execute');
    expect(restExecute).toHaveTextContent('Rest (30s)');
  });

  it('progresses to second task after completing rest', () => {
    render(<ExecuteLayout />);

    // Complete first task
    fireEvent.click(screen.getByText('Continue'));
    // Complete rest
    fireEvent.click(screen.getByText('Continue'));

    const taskExecute = screen.getByTestId('task-execute');
    expect(taskExecute).toHaveTextContent('Bench Press (Set 2)');
  });

  it('shows completion message after completing all items', () => {
    render(<ExecuteLayout />);

    // Complete first task
    fireEvent.click(screen.getByText('Continue'));
    // Complete rest
    fireEvent.click(screen.getByText('Continue'));
    // Complete second task
    fireEvent.click(screen.getByText('Continue'));

    expect(screen.getByText('Plan completed!')).toBeInTheDocument();
  });

  it('tracks plan completion when all items are completed', async () => {
    const { setPlanCompletionDate } = await import('@/services/planCompletion');

    render(<ExecuteLayout />);

    // Complete all items
    fireEvent.click(screen.getByText('Continue')); // First task
    fireEvent.click(screen.getByText('Continue')); // Rest
    fireEvent.click(screen.getByText('Continue')); // Second task

    // Verify completion tracking was called
    expect(setPlanCompletionDate).toHaveBeenCalledWith(mockPlan.slug);
  });

  it('does not track completion when plan is not complete', async () => {
    const { setPlanCompletionDate } = await import('@/services/planCompletion');

    render(<ExecuteLayout />);

    // Complete only first task
    fireEvent.click(screen.getByText('Continue'));

    // Verify completion tracking was not called
    expect(setPlanCompletionDate).not.toHaveBeenCalled();
  });
});
