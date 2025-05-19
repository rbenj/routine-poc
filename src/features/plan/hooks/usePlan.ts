import { useState, useEffect } from 'react';
import type { Plan } from '@/models';
import { dataManager } from '@/services';

export function usePlan(name: string | undefined): Plan | undefined {
  const [plan, setPlan] = useState<Plan | undefined>(undefined);

  useEffect(() => {
    setPlan(name ? dataManager.getPlan(name) : undefined);
  }, [name]);

  return plan;
}
