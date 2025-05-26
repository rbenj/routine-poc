import { describe, it, expect } from 'vitest';
import {
  formatDistance,
  formatFuzzyDuration,
  formatNumber,
  formatMinutes,
  formatSlug,
  formatTimer,
  formatWeight,
} from './format-strings';

describe('format-strings', () => {
  describe('formatDistance', () => {
    it('formats distance with default unit', () => {
      expect(formatDistance(5.5)).toBe('5.5 mi');
    });

    it('formats distance with custom unit', () => {
      expect(formatDistance(5.5, 'km')).toBe('5.5 km');
    });
  });

  describe('formatFuzzyDuration', () => {
    it('formats seconds', () => {
      expect(formatFuzzyDuration(45)).toBe('45 seconds');
      expect(formatFuzzyDuration(45, true)).toBe('45 sec');
    });

    it('formats minutes', () => {
      expect(formatFuzzyDuration(90)).toBe('2 minutes');
      expect(formatFuzzyDuration(90, true)).toBe('2 min');
    });

    it('formats hours', () => {
      expect(formatFuzzyDuration(3600)).toBe('1 hour');
      expect(formatFuzzyDuration(7200)).toBe('2 hours');
      expect(formatFuzzyDuration(3600, true)).toBe('1 hr');
    });

    it('handles negative durations', () => {
      expect(formatFuzzyDuration(-45)).toBe('-45 seconds');
      expect(formatFuzzyDuration(-90)).toBe('-2 minutes');
      expect(formatFuzzyDuration(-3600)).toBe('-1 hour');
    });
  });

  describe('formatNumber', () => {
    it('formats number with specified decimals', () => {
      expect(formatNumber(5.1234, 2)).toBe('5.12');
      expect(formatNumber(5.1234, 0)).toBe('5');
    });
  });

  describe('formatMinutes', () => {
    it('formats minutes with default unit', () => {
      expect(formatMinutes(90)).toBe('1 min');
    });

    it('formats minutes with custom unit', () => {
      expect(formatMinutes(90, 'minutes')).toBe('1 minutes');
    });

    it('handles negative seconds', () => {
      expect(formatMinutes(-90)).toBe('1 min');
    });
  });

  describe('formatSlug', () => {
    it('converts string to slug format', () => {
      expect(formatSlug('Hello World!')).toBe('hello-world');
      expect(formatSlug('Test & More')).toBe('test-more');
      expect(formatSlug('123 Test')).toBe('123-test');
    });
  });

  describe('formatTimer', () => {
    it('formats timer in MM:SS format', () => {
      expect(formatTimer(65)).toBe('1:05');
      expect(formatTimer(130)).toBe('2:10');
    });

    it('handles negative durations', () => {
      expect(formatTimer(-65)).toBe('-1:05');
    });

    it('handles zero', () => {
      expect(formatTimer(0)).toBe('0:00');
    });
  });

  describe('formatWeight', () => {
    it('formats weight with default unit', () => {
      expect(formatWeight(150.5)).toBe('151 lbs');
    });

    it('formats weight with custom unit', () => {
      expect(formatWeight(150.5, 'kg')).toBe('151 kg');
    });
  });
});
