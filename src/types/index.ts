export type FieldType = 'int' | 'float' | 'weight' | 'distance' | 'timer_down' | 'timer_up';
export type InitialValueSource = 'default' | 'memory';
export type TaskType = 'task' | 'rest';

export interface Field {
    name: string;
    type: FieldType;
    initialValueSource: InitialValueSource;
    defaultValue: number;
    minValue: number;
    maxValue: number;
}

export interface Task {
    type: TaskType;
    name: string;
    estimatedTimeSec: number;
    fields?: Field[];
}

export interface Rest {
    type: 'rest';
    durationSec: number;
}

export interface Plan {
    name: string;
    tasks: (Task | Rest)[];
}

export interface PlanState {
    plans: Plan[];
} 
