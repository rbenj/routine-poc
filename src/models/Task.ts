import type { FieldData } from './Field';
import { Field } from './Field';

export interface TaskData {
  estimatedSeconds: number;
  fields: FieldData[];
  key: string;
  name: string;
  set: number;
  type: 'task';
}

export class Task {
  estimatedSeconds: number;
  fields: Field[];
  key: string;
  name: string;
  set: number;
  type: 'task';

  constructor(raw: TaskData) {
    this.estimatedSeconds = raw.estimatedSeconds;
    this.fields = raw.fields.map(v => new Field(v));
    this.key = raw.key;
    this.name = raw.name;
    this.set = raw.set;
    this.type = raw.type;
  }

  getTimerDurationSeconds(): number {
    return this.fields.find(v => v.type === 'timer_down')?.value ?? 0;
  }
}
