import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlans } from './usePlans';
import { Plan } from '@/models';
import { dataManager } from '@/services';

// Mock the dataManager
vi.mock('@/services', () => ({
  dataManager: {
    getAllPlans: vi.fn(),
  },
}));

describe('usePlans', () => {
  const mockPlans = [
    new Plan({
      name: 'Plan 1',
      items: [],
      assignment: [],
    }),
    new Plan({
      name: 'Plan 2',
      items: [],
      assignment: [],
    }),
  ];

  it('returns plans from dataManager', () => {
    vi.mocked(dataManager.getAllPlans).mockReturnValue(mockPlans);

    const { result } = renderHook(() => usePlans());

    expect(result.current).toEqual(mockPlans);
    // In strict mode, useEffect runs twice in development
    expect(dataManager.getAllPlans).toHaveBeenCalled();
  });

  it('returns empty array when dataManager returns no plans', () => {
    vi.mocked(dataManager.getAllPlans).mockReturnValue([]);

    const { result } = renderHook(() => usePlans());

    expect(result.current).toEqual([]);
    // In strict mode, useEffect runs twice in development
    expect(dataManager.getAllPlans).toHaveBeenCalled();
  });
});
