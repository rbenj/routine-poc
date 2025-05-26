import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlansByDay } from './usePlansByDay';
import { usePlans } from './usePlans';
import { Plan } from '@/models';
import { DayOfWeek } from '@/types';

// Mock the usePlans hook
vi.mock('./usePlans', () => ({
  usePlans: vi.fn(),
}));

describe('usePlansByDay', () => {
  const mockPlans = [
    new Plan({
      name: 'Plan 1',
      items: [],
      assignment: [
        { dayOfWeek: DayOfWeek.Monday, order: 1 },
        { dayOfWeek: DayOfWeek.Wednesday, order: 1 },
      ],
    }),
    new Plan({
      name: 'Plan 2',
      items: [],
      assignment: [
        { dayOfWeek: DayOfWeek.Monday, order: 2 },
        { dayOfWeek: DayOfWeek.Friday, order: 1 },
      ],
    }),
  ];

  it('organizes plans by day of week', () => {
    vi.mocked(usePlans).mockReturnValue(mockPlans);

    const { result } = renderHook(() => usePlansByDay());

    const plansByDay = result.current;
    expect(plansByDay.get(DayOfWeek.Monday)).toEqual([mockPlans[0], mockPlans[1]]);
    expect(plansByDay.get(DayOfWeek.Wednesday)).toEqual([mockPlans[0]]);
    expect(plansByDay.get(DayOfWeek.Friday)).toEqual([mockPlans[1]]);
    expect(plansByDay.get(DayOfWeek.Tuesday)).toBeUndefined();
  });

  it('handles empty plans array', () => {
    vi.mocked(usePlans).mockReturnValue([]);

    const { result } = renderHook(() => usePlansByDay());

    const plansByDay = result.current;
    expect(plansByDay.size).toBe(0);
  });
});
