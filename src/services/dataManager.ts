import plansData from '@/data/plans';
import { Plan } from '@/models';

const data = plansData.map(v => new Plan(v));

export const dataManager = {
  getAllPlans(): Plan[] {
    return data;
  },

  getPlan(slug: string): Plan | undefined {
    return data.find(v => v.slug === slug);
  },
};
