import { useState, useEffect } from 'react';
import type { Plan } from '@/models';
import { dataManager } from '@/services';

export function usePlans(): Plan[] {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    setPlans(dataManager.getAllPlans());
  }, []);

  return plans;
}
