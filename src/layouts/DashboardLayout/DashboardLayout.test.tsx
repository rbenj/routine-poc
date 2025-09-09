import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests';
import { DashboardLayout } from './DashboardLayout';
import { usePlansByDay } from '@/features/plan';
import { Plan } from '@/models';
import { DayOfWeek } from '@/types';

// Mock the hooks and services
vi.mock('@/features/plan', () => ({
  usePlansByDay: vi.fn(),
  PlanCard: vi.fn(({ name, estimatedSeconds, lastCompletedDate }) => (
    <div data-testid="plan-card">
      {name}
      {' '}
      (
      {estimatedSeconds}
      s)
      {lastCompletedDate && ` - Last completed: ${lastCompletedDate.toLocaleDateString()}`}
    </div>
  )),
}));

vi.mock('@/services/planCompletion', () => ({
  getPlanCompletionDate: vi.fn(),
}));

describe('DashboardLayout', () => {
  const mockPlansByDay = new Map([
    [
      DayOfWeek.Monday,
      [
        new Plan({
          name: 'Monday Plan 1',
          items: [],
          assignment: [{ dayOfWeek: DayOfWeek.Monday, order: 1 }],
        }),
        new Plan({
          name: 'Monday Plan 2',
          items: [],
          assignment: [{ dayOfWeek: DayOfWeek.Monday, order: 2 }],
        }),
      ],
    ],
    [
      DayOfWeek.Wednesday,
      [
        new Plan({
          name: 'Wednesday Plan',
          items: [],
          assignment: [{ dayOfWeek: DayOfWeek.Wednesday, order: 1 }],
        }),
      ],
    ],
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlansByDay).mockReturnValue(mockPlansByDay);
  });

  it('renders summary with total number of plans', () => {
    render(<DashboardLayout />);

    expect(screen.getByText('You have 3 plans assigned')).toBeInTheDocument();
  });

  it('renders plans for each day', () => {
    render(<DashboardLayout />);

    // Check Monday plans
    expect(screen.getByText('Monday')).toBeInTheDocument();
    const planCards = screen.getAllByTestId('plan-card');
    expect(planCards).toHaveLength(3);
    expect(planCards[0]).toHaveTextContent('Monday Plan 1');
    expect(planCards[1]).toHaveTextContent('Monday Plan 2');
    expect(planCards[2]).toHaveTextContent('Wednesday Plan');
  });

  it('renders empty state when no plans are assigned', () => {
    vi.mocked(usePlansByDay).mockReturnValue(new Map());

    render(<DashboardLayout />);

    expect(screen.getByText('You have 0 plans assigned')).toBeInTheDocument();
  });

  it('passes completion dates to PlanCard components', async () => {
    const { getPlanCompletionDate } = await import('@/services/planCompletion');
    const mockCompletionDate = new Date('2024-01-15T10:30:00Z');

    vi.mocked(getPlanCompletionDate)
      .mockReturnValueOnce(null) // First plan has no completion date
      .mockReturnValueOnce(mockCompletionDate) // Second plan has completion date
      .mockReturnValueOnce(null); // Third plan has no completion date

    render(<DashboardLayout />);

    const planCards = screen.getAllByTestId('plan-card');
    expect(planCards[0]).toHaveTextContent('Monday Plan 1');
    expect(planCards[0]).not.toHaveTextContent('Last completed');

    expect(planCards[1]).toHaveTextContent('Monday Plan 2');
    expect(planCards[1]).toHaveTextContent('Last completed');

    expect(planCards[2]).toHaveTextContent('Wednesday Plan');
    expect(planCards[2]).not.toHaveTextContent('Last completed');
  });
});
