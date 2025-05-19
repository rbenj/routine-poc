import plansData from '@/data/plans';
import { Plan } from '@/models';

const data = plansData.map(v => new Plan(v));

export const dataManager = {
  getAllPlans(): Plan[] {
    return data;
  },

  getPlan(name: string): Plan | undefined {
    return data.find(v => v.name === name);
  },
};
