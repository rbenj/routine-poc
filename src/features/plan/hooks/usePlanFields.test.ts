import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlanFields } from './usePlanFields';
import { Plan } from '@/models';
import type { FieldInitialValueSource, FieldType } from '@/models';
import { robustStorage } from '@/utils';

// Mock the robustStorage
vi.mock('@/utils', () => ({
  robustStorage: {
    hasItem: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
  formatSlug: vi.fn((value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
}));

describe('usePlanFields', () => {
  const mockPlanData = {
    name: 'Test Plan',
    items: [
      {
        type: 'task' as const,
        key: 'task1',
        name: 'Task 1',
        estimatedSeconds: 60,
        set: 1,
        fields: [
          {
            key: 'weight',
            name: 'Weight',
            type: 'weight' as FieldType,
            value: 100,
            defaultValue: 100,
            minValue: 0,
            maxValue: 500,
            initialValueSource: 'memory' as FieldInitialValueSource,
          },
          {
            key: 'reps',
            name: 'Reps',
            type: 'int' as FieldType,
            value: 10,
            defaultValue: 10,
            minValue: 0,
            maxValue: 20,
            initialValueSource: 'default' as FieldInitialValueSource,
          },
        ],
      },
    ],
    assignment: [],
  };

  const mockPlan = new Plan(mockPlanData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty fields when no plan is provided', () => {
    const { result } = renderHook(() => usePlanFields(undefined));

    expect(result.current.getTaskFields('task1')).toEqual([]);
  });

  it('initializes with plan fields', () => {
    const { result } = renderHook(() => usePlanFields(mockPlan));

    const fields = result.current.getTaskFields('task1');
    expect(fields).toHaveLength(2);
    expect(fields[0]).toEqual(mockPlanData.items[0].fields[0]);
    expect(fields[1]).toEqual(mockPlanData.items[0].fields[1]);
  });

  it('loads stored values for memory fields', () => {
    const storedValue = 150;
    vi.mocked(robustStorage.hasItem).mockReturnValue(true);
    vi.mocked(robustStorage.getItem).mockReturnValue(storedValue);

    const { result } = renderHook(() => usePlanFields(mockPlan));

    const fields = result.current.getTaskFields('task1');
    expect(fields[0].value).toBe(storedValue);
    expect(robustStorage.hasItem).toHaveBeenCalledWith('field-value-v1-task1-weight');
    expect(robustStorage.getItem).toHaveBeenCalledWith('field-value-v1-task1-weight', 0);
  });

  it('updates field value and saves to storage', () => {
    const { result } = renderHook(() => usePlanFields(mockPlan));

    act(() => {
      result.current.setTaskFieldValue('task1', 'weight', 200);
    });

    const fields = result.current.getTaskFields('task1');
    expect(fields[0].value).toBe(200);
    expect(robustStorage.setItem).toHaveBeenCalledWith('field-value-v1-task1-weight', 200);
  });

  it('preserves other fields when updating a single field', () => {
    const { result } = renderHook(() => usePlanFields(mockPlan));

    act(() => {
      result.current.setTaskFieldValue('task1', 'weight', 200);
    });

    const fields = result.current.getTaskFields('task1');
    expect(fields[1]).toEqual(mockPlanData.items[0].fields[1]);
  });

  it('handles non-existent task keys', () => {
    const { result } = renderHook(() => usePlanFields(mockPlan));

    expect(result.current.getTaskFields('nonExistentTask')).toEqual([]);
  });
});
