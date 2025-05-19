import type { FieldType } from '@/models';
import { formatDistance, formatNumber, formatTimer, formatWeight } from '@/utils';

const formatters: {
  [K in FieldType]: (value: number) => string;
} = {
  distance: formatDistance,
  float: (value: number) => formatNumber(value, 2),
  int: (value: number) => formatNumber(value, 0),
  timer_down: formatTimer,
  weight: formatWeight,
};

export function formatField(type: FieldType, value: number): string {
  return formatters[type](value);
}
