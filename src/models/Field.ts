import { formatSlug } from '@/utils';

export type FieldType =
  'distance' |
  'float' |
  'int' |
  'timer_down' |
  'weight';

export type FieldInitialValueSource =
  'default' |
  'memory';

export interface FieldData {
  defaultValue: number;
  initialValueSource: FieldInitialValueSource;
  key?: string;
  maxValue: number;
  minValue: number;
  name: string;
  type: FieldType;
  value?: number;
}

export class Field {
  defaultValue: number;
  initialValueSource: FieldInitialValueSource;
  key: string;
  maxValue: number;
  minValue: number;
  name: string;
  type: FieldType;
  value: number;

  constructor(raw: FieldData) {
    this.defaultValue = raw.defaultValue;
    this.initialValueSource = raw.initialValueSource;
    this.key = raw.key || formatSlug(raw.name);
    this.maxValue = raw.maxValue;
    this.minValue = raw.minValue;
    this.name = raw.name;
    this.type = raw.type;
    this.value = raw.value === undefined ? raw.defaultValue : raw.value;
  }
}
