import { describe, it, expect } from 'vitest';
import { calculateMaxShutter, formatShutterFraction, getTrailRisk, parseAperture, calculateEffectiveFocalLength } from './astro';

describe('Astro Utilities', () => {
  describe('calculateMaxShutter', () => {
    it('should calculate correct shutter speed for 500 rule', () => {
      const result = calculateMaxShutter(50, 1.5, 500);
      expect(result).toBeCloseTo(6.67, 2);
    });

    it('should calculate correct shutter speed for 400 rule', () => {
      const result = calculateMaxShutter(24, 1.0, 400);
      expect(result).toBeCloseTo(16.67, 2);
    });

    it('should handle zero focal length', () => {
      const result = calculateMaxShutter(0, 1.5, 500);
      expect(result).toBeNull();
    });

    it('should handle negative focal length', () => {
      const result = calculateMaxShutter(-50, 1.5, 500);
      expect(result).toBeNull();
    });
  });

  describe('formatShutterFraction', () => {
    it('should format shutter speeds >= 1 second correctly', () => {
      expect(formatShutterFraction(2)).toBe('1/0.5 s');
      expect(formatShutterFraction(1)).toBe('1/1.0 s');
    });

    it('should format shutter speeds < 1 second as nearest common fraction', () => {
      expect(formatShutterFraction(0.004)).toContain('1/250');
      expect(formatShutterFraction(0.008)).toContain('1/125');
      expect(formatShutterFraction(0.02)).toContain('1/50');
    });
  });

  describe('getTrailRisk', () => {
    it('should return low risk for wide angle lenses', () => {
      expect(getTrailRisk(14, 1.0)).toBe('low');
      expect(getTrailRisk(24, 1.0)).toBe('low');
    });

    it('should return medium risk for standard lenses', () => {
      expect(getTrailRisk(50, 1.0)).toBe('medium');
      expect(getTrailRisk(85, 1.0)).toBe('medium');
    });

    it('should return high risk for telephoto lenses', () => {
      expect(getTrailRisk(100, 1.0)).toBe('high');
      expect(getTrailRisk(200, 1.0)).toBe('high');
    });
  });

  describe('parseAperture', () => {
    it('should parse aperture strings correctly', () => {
      expect(parseAperture('f/2.8')).toBe(2.8);
      expect(parseAperture('F/1.4')).toBe(1.4);
      expect(parseAperture('2.8')).toBe(2.8);
      expect(parseAperture('f1.8')).toBe(1.8);
    });

    it('should return null for invalid aperture strings', () => {
      expect(parseAperture('')).toBeNull();
      expect(parseAperture('invalid')).toBeNull();
      expect(parseAperture(undefined)).toBeNull();
    });
  });

  describe('calculateEffectiveFocalLength', () => {
    it('should calculate effective focal length correctly', () => {
      expect(calculateEffectiveFocalLength(50, 1.5)).toBe(75);
      expect(calculateEffectiveFocalLength(24, 1.0)).toBe(24);
      expect(calculateEffectiveFocalLength(35, 1.6)).toBe(56);
    });
  });
});