import { describe, it, expect, vi } from 'vitest';
import { dataManager } from './dataManager';
import { Plan } from '@/models';

// Mock the plans data
vi.mock('@/data/plans', () => ({
  default: [
    {
      name: 'plan1',
      assignment: [
        { dayOfWeek: 'monday', order: 1 },
      ],
      items: [
        {
          type: 'task',
          name: 'Task 1',
          estimatedSeconds: 300,
          fields: [],
        },
      ],
    },
    {
      name: 'plan2',
      assignment: [
        { dayOfWeek: 'tuesday', order: 1 },
      ],
      items: [
        {
          type: 'rest',
          name: 'Rest 1',
          durationSeconds: 60,
        },
      ],
    },
  ],
}));

describe('dataManager', () => {
  describe('getAllPlans', () => {
    it('returns all plans', () => {
      const plans = dataManager.getAllPlans();
      expect(plans).toHaveLength(2);
      expect(plans[0]).toBeInstanceOf(Plan);
      expect(plans[1]).toBeInstanceOf(Plan);
      expect(plans[0].name).toBe('plan1');
      expect(plans[1].name).toBe('plan2');
    });
  });

  describe('getPlan', () => {
    it('returns plan by name', () => {
      const plan = dataManager.getPlan('plan1');
      expect(plan).toBeInstanceOf(Plan);
      expect(plan?.name).toBe('plan1');
    });

    it('returns undefined for non-existent plan', () => {
      const plan = dataManager.getPlan('non-existent');
      expect(plan).toBeUndefined();
    });
  });
});
