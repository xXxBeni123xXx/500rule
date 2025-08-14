import { describe, it, expect } from 'vitest';
import { 
  calculateMaxShutter, 
  formatShutterFraction, 
  getTrailRisk, 
  parseAperture, 
  calculateEffectiveFocalLength,
  calculateNPFRule,
  calculateSimplifiedRule,
  calculatePixelPitch,
  getRecommendedISO
} from './astro';

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

  describe('calculateNPFRule', () => {
    it('should calculate NPF rule correctly', () => {
      // 24mm f/2.8 with 4.3μm pixel pitch
      const result = calculateNPFRule(24, 2.8, 4.3);
      expect(result).toBeCloseTo(9.46, 1);
    });

    it('should handle declination correction', () => {
      const result0 = calculateNPFRule(24, 2.8, 4.3, 0);
      const result45 = calculateNPFRule(24, 2.8, 4.3, 45);
      expect(result45).toBeGreaterThan(result0!);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateNPFRule(0, 2.8, 4.3)).toBeNull();
      expect(calculateNPFRule(24, 0, 4.3)).toBeNull();
      expect(calculateNPFRule(24, 2.8, 0)).toBeNull();
    });
  });

  describe('calculateSimplifiedRule', () => {
    it('should calculate simplified rule correctly', () => {
      expect(calculateSimplifiedRule(50, 1.5)).toBeCloseTo(4.0, 1);
      expect(calculateSimplifiedRule(24, 1.0)).toBeCloseTo(12.5, 1);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateSimplifiedRule(0, 1.5)).toBeNull();
      expect(calculateSimplifiedRule(50, 0)).toBeNull();
    });
  });

  describe('calculatePixelPitch', () => {
    it('should calculate pixel pitch correctly', () => {
      // Full frame sensor (36x24mm) with 24MP
      const result = calculatePixelPitch(36, 24, 24);
      expect(result).toBeCloseTo(6.0, 1);
    });

    it('should return null for invalid inputs', () => {
      expect(calculatePixelPitch(0, 24, 24)).toBeNull();
      expect(calculatePixelPitch(36, 0, 24)).toBeNull();
      expect(calculatePixelPitch(36, 24, 0)).toBeNull();
    });
  });

  describe('getRecommendedISO', () => {
    it('should recommend appropriate ISO for dark skies', () => {
      const iso = getRecommendedISO(2.8, 10, 'dark');
      expect(iso).toBeGreaterThanOrEqual(1600);
      expect(iso).toBeLessThanOrEqual(6400);
    });

    it('should recommend lower ISO for urban skies', () => {
      const darkISO = getRecommendedISO(2.8, 10, 'dark');
      const urbanISO = getRecommendedISO(2.8, 10, 'urban');
      expect(urbanISO).toBeLessThan(darkISO);
    });

    it('should adjust ISO based on aperture', () => {
      const isoF14 = getRecommendedISO(1.4, 10, 'dark');
      const isoF28 = getRecommendedISO(2.8, 10, 'dark');
      expect(isoF14).toBeLessThan(isoF28);
    });
  });
});