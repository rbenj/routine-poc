import { useState, useEffect } from 'react';
import type { Plan } from '@/models';
import { dataManager } from '@/services';

export function usePlan(slug: string | undefined): Plan | undefined {
  const [plan, setPlan] = useState<Plan | undefined>(undefined);

  useEffect(() => {
    setPlan(slug ? dataManager.getPlan(slug) : undefined);
  }, [slug]);

  return plan;
}
