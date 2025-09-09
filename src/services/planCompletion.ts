import { robustStorage } from '@/utils/robustStorage';

const COMPLETION_STORAGE_PREFIX = 'plan_completion_';

export function getPlanCompletionDate(planSlug: string): Date | null {
  const storageKey = `${COMPLETION_STORAGE_PREFIX}${planSlug}`;
  const storedDate = robustStorage.getItem(storageKey, '');

  if (storedDate === '') {
    return null;
  }

  try {
    const date = new Date(storedDate);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function setPlanCompletionDate(planSlug: string, date: Date = new Date()): void {
  const storageKey = `${COMPLETION_STORAGE_PREFIX}${planSlug}`;
  robustStorage.setItem(storageKey, date.toISOString());
}
