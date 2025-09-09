import type { DayOfWeek } from '@/types';
import { formatSlug } from '@/utils';
import type { RestData } from './Rest';
import { Rest } from './Rest';
import type { TaskData } from './Task';
import { Task } from './Task';

export interface PlanAssignment {
  dayOfWeek: DayOfWeek;
  order: number;
}

export interface PlanData {
  assignment: PlanAssignment[];
  items: (TaskData | RestData)[];
  name: string;
}

export class Plan {
  assignment: PlanAssignment[];
  items: (Task | Rest)[];
  name: string;
  slug: string;

  constructor(raw: PlanData) {
    this.assignment = raw.assignment;
    this.items = raw.items.map(v => v.type === 'task' ? new Task(v) : new Rest(v));
    this.name = raw.name;
    this.slug = formatSlug(raw.name);
  }

  getEstimatedSeconds(): number {
    return this.getRemainingSeconds(0);
  }

  getRemainingSeconds(index: number): number {
    return this.items.slice(index).reduce((acc, item) => {
      return acc + (item.type === 'task' ? item.estimatedSeconds : item.durationSeconds);
    }, 0);
  }

  getItems(index: number, limit: number): (TaskData | RestData)[] {
    return this.items.slice(index, index + limit);
  }

  getQueueItems(index: number, limit: number): TaskData[] {
    const remainingItems = this.items.slice(index);
    const taskItems = remainingItems.filter(item => item.type === 'task');
    return taskItems.slice(0, limit).map(item => item as TaskData);
  }
}
