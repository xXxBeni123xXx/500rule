import { describe, it, expect } from 'vitest';
import { parseFocalLength, formatFocalLength, clampFocalLength } from './focal';

describe('Focal Length Utilities', () => {
  describe('parseFocalLength', () => {
    it('should parse prime lens focal lengths', () => {
      expect(parseFocalLength('14')).toEqual({
        type: 'prime',
        min: 14
      });
      expect(parseFocalLength('50mm')).toEqual({
        type: 'prime',
        min: 50
      });
      expect(parseFocalLength('85MM')).toEqual({
        type: 'prime',
        min: 85
      });
      expect(parseFocalLength('135 mm')).toEqual({
        type: 'prime',
        min: 135
      });
    });

    it('should parse zoom lens focal lengths with hyphen', () => {
      expect(parseFocalLength('24-70')).toEqual({
        type: 'zoom',
        min: 24,
        max: 70
      });
      expect(parseFocalLength('70-200mm')).toEqual({
        type: 'zoom',
        min: 70,
        max: 200
      });
      expect(parseFocalLength('16-35 mm')).toEqual({
        type: 'zoom',
        min: 16,
        max: 35
      });
    });

    it('should parse zoom lens focal lengths with en-dash', () => {
      expect(parseFocalLength('24–70')).toEqual({
        type: 'zoom',
        min: 24,
        max: 70
      });
      expect(parseFocalLength('70–200mm')).toEqual({
        type: 'zoom',
        min: 70,
        max: 200
      });
    });

    it('should handle decimal focal lengths', () => {
      expect(parseFocalLength('12.5')).toEqual({
        type: 'prime',
        min: 12.5
      });
      expect(parseFocalLength('17.5-55.5mm')).toEqual({
        type: 'zoom',
        min: 17.5,
        max: 55.5
      });
    });

    it('should handle various formatting', () => {
      expect(parseFocalLength('  24  ')).toEqual({
        type: 'prime',
        min: 24
      });
      expect(parseFocalLength('24 - 70')).toEqual({
        type: 'zoom',
        min: 24,
        max: 70
      });
      expect(parseFocalLength('24MM')).toEqual({
        type: 'prime',
        min: 24
      });
    });

    it('should return null for invalid inputs', () => {
      expect(parseFocalLength('')).toBeNull();
      expect(parseFocalLength(undefined)).toBeNull();
      expect(parseFocalLength('invalid')).toBeNull();
      expect(parseFocalLength('mm')).toBeNull();
      expect(parseFocalLength('24-')).toBeNull();
      expect(parseFocalLength('-70')).toBeNull();
    });

    it('should return null for invalid zoom ranges', () => {
      expect(parseFocalLength('70-24')).toBeNull(); // Max < Min
      expect(parseFocalLength('50-50')).toBeNull(); // Max = Min
    });

    it('should return null for zero or negative values', () => {
      expect(parseFocalLength('0')).toBeNull();
      expect(parseFocalLength('-24')).toBeNull();
      expect(parseFocalLength('0-70')).toBeNull();
    });
  });

  describe('formatFocalLength', () => {
    it('should format prime lens focal lengths', () => {
      expect(formatFocalLength({ type: 'prime', min: 50 })).toBe('50mm');
      expect(formatFocalLength({ type: 'prime', min: 85 })).toBe('85mm');
      expect(formatFocalLength({ type: 'prime', min: 135 })).toBe('135mm');
    });

    it('should format zoom lens focal lengths', () => {
      expect(formatFocalLength({ type: 'zoom', min: 24, max: 70 })).toBe('24-70mm');
      expect(formatFocalLength({ type: 'zoom', min: 70, max: 200 })).toBe('70-200mm');
      expect(formatFocalLength({ type: 'zoom', min: 16, max: 35 })).toBe('16-35mm');
    });

    it('should handle decimal values', () => {
      expect(formatFocalLength({ type: 'prime', min: 12.5 })).toBe('12.5mm');
      expect(formatFocalLength({ type: 'zoom', min: 17.5, max: 55.5 })).toBe('17.5-55.5mm');
    });
  });

  describe('clampFocalLength', () => {
    it('should clamp values for prime lenses', () => {
      const prime = { type: 'prime' as const, min: 50 };
      
      expect(clampFocalLength(30, prime)).toBe(50);
      expect(clampFocalLength(50, prime)).toBe(50);
      expect(clampFocalLength(70, prime)).toBe(50);
    });

    it('should clamp values within zoom range', () => {
      const zoom = { type: 'zoom' as const, min: 24, max: 70 };
      
      expect(clampFocalLength(10, zoom)).toBe(24);
      expect(clampFocalLength(24, zoom)).toBe(24);
      expect(clampFocalLength(35, zoom)).toBe(35);
      expect(clampFocalLength(50, zoom)).toBe(50);
      expect(clampFocalLength(70, zoom)).toBe(70);
      expect(clampFocalLength(100, zoom)).toBe(70);
    });

    it('should handle edge cases', () => {
      const zoom = { type: 'zoom' as const, min: 70, max: 200 };
      
      expect(clampFocalLength(69.9, zoom)).toBe(70);
      expect(clampFocalLength(70, zoom)).toBe(70);
      expect(clampFocalLength(200, zoom)).toBe(200);
      expect(clampFocalLength(200.1, zoom)).toBe(200);
    });

    it('should handle decimal values', () => {
      const zoom = { type: 'zoom' as const, min: 17.5, max: 55.5 };
      
      expect(clampFocalLength(10, zoom)).toBe(17.5);
      expect(clampFocalLength(30.7, zoom)).toBe(30.7);
      expect(clampFocalLength(60, zoom)).toBe(55.5);
    });
  });
});