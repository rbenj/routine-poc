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

    const orderedMap = new Map<DayOfWeek, Plan[]>();

    Object.values(DayOfWeek)
      .filter(day => typeof day === 'number')
      .forEach((day) => {
        const dayPlans = map.get(day as DayOfWeek);
        if (dayPlans && dayPlans.length > 0) {
          orderedMap.set(day as DayOfWeek, dayPlans);
        }
      });

    return orderedMap;
  }, [plans]);
}
