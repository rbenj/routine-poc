import { describe, it, expect } from 'vitest';
import { formatField } from './formatField';

describe('formatField', () => {
  it('formats distance values', () => {
    expect(formatField('distance', 5.5)).toBe('5.5 mi');
  });

  it('formats float values', () => {
    expect(formatField('float', 5.1234)).toBe('5.12');
  });

  it('formats int values', () => {
    expect(formatField('int', 5.1234)).toBe('5');
  });

  it('formats timer_down values', () => {
    expect(formatField('timer_down', 65)).toBe('1:05');
    expect(formatField('timer_down', 0)).toBe('0:00');
    expect(formatField('timer_down', -65)).toBe('-1:05');
  });

  it('formats weight values', () => {
    expect(formatField('weight', 150.5)).toBe('151 lbs');
  });

  it('handles negative values', () => {
    expect(formatField('distance', -5.5)).toBe('-5.5 mi');
    expect(formatField('float', -5.1234)).toBe('-5.12');
    expect(formatField('int', -5.1234)).toBe('-5');
    expect(formatField('weight', -150.5)).toBe('-151 lbs');
  });
});
