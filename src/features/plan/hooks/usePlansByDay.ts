import { useMemo } from 'react';
import type { Plan } from '@/models';
import { DayOfWeek } from '@/types';
import { usePlans } from './usePlans';

export function usePlansByDay(): Map<DayOfWeek, Plan[]> {
  const plans = usePlans();

  return useMemo(() => {
    const map = new Map<DayOfWeek, Plan[]>();

    plans.forEach((plan) => {
      plan.assignment.forEach(({ dayOfWeek }) => {
        const dayPlans = map.get(dayOfWeek) || [];
        dayPlans.push(plan);
        map.set(dayOfWeek, dayPlans);
      });
    });

    return map;
  }, [plans]);
}
