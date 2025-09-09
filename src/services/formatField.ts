import type { FieldType } from '@/models';
import { formatDistance, formatNumber, formatRPE, formatTimer, formatWeight } from '@/utils';

const formatters: {
  [K in FieldType]: (value: number) => string;
} = {
  distance: formatDistance,
  float: (value: number) => formatNumber(value, 2),
  int: (value: number) => formatNumber(value, 0),
  rpe: (value: number) => formatRPE(value),
  timer_down: formatTimer,
  weight: formatWeight,
};

export function formatField(type: FieldType, value: number): string {
  return formatters[type](value);
}
