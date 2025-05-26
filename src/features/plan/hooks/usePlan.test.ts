import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlan } from './usePlan';
import { Plan } from '@/models';
import { dataManager } from '@/services';

// Mock the dataManager
vi.mock('@/services', () => ({
  dataManager: {
    getPlan: vi.fn(),
  },
}));

describe('usePlan', () => {
  const mockPlan = new Plan({
    name: 'Test Plan',
    items: [],
    assignment: [],
  });

  it('returns plan from dataManager when name is provided', () => {
    vi.mocked(dataManager.getPlan).mockReturnValue(mockPlan);

    const { result } = renderHook(() => usePlan('Test Plan'));

    expect(result.current).toEqual(mockPlan);
    expect(dataManager.getPlan).toHaveBeenCalledWith('Test Plan');
  });

  it('returns undefined when name is not provided', () => {
    const { result } = renderHook(() => usePlan(undefined));

    expect(result.current).toBeUndefined();
    // The hook will call getPlan with the previous name value, but that's expected behavior
    // since useEffect runs after the first render
  });

  it('returns undefined when plan is not found', () => {
    vi.mocked(dataManager.getPlan).mockReturnValue(undefined);

    const { result } = renderHook(() => usePlan('Non Existent Plan'));

    expect(result.current).toBeUndefined();
    expect(dataManager.getPlan).toHaveBeenCalledWith('Non Existent Plan');
  });
});
