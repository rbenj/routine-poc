import { describe, it, expect } from 'vitest';
import { colorClassName } from './colorPicker';

describe('colorPicker', () => {
  describe('colorClassName', () => {
    it('returns color1 for index 0', () => {
      expect(colorClassName(0)).toBe('color1');
    });

    it('returns color2 for index 1', () => {
      expect(colorClassName(1)).toBe('color2');
    });

    it('returns color3 for index 2', () => {
      expect(colorClassName(2)).toBe('color3');
    });

    it('returns color4 for index 3', () => {
      expect(colorClassName(3)).toBe('color4');
    });

    it('wraps around after color4', () => {
      expect(colorClassName(4)).toBe('color1');
      expect(colorClassName(5)).toBe('color2');
      expect(colorClassName(6)).toBe('color3');
      expect(colorClassName(7)).toBe('color4');
    });

    it('handles negative indices', () => {
      expect(colorClassName(-1)).toBe('color4');
      expect(colorClassName(-2)).toBe('color3');
      expect(colorClassName(-3)).toBe('color2');
      expect(colorClassName(-4)).toBe('color1');
    });
  });
});
