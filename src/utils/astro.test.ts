import { describe, it, expect } from 'vitest';
import {
  calculateMaxShutter,
  getCropFactorFromFormat,
  calculateEffectiveFocalLength,
  formatShutterFraction,
  parseAperture,
  getTrailRisk,
  calculatePixelPitch,
  calculateNPFRule,
  getRecommendedRule
} from './astro';

describe('Astro Calculations', () => {
  describe('calculateMaxShutter', () => {
    it('should calculate correct shutter speed with 500 rule', () => {
      expect(calculateMaxShutter(50, 1.5, 500)).toBeCloseTo(6.67, 2);
      expect(calculateMaxShutter(24, 1.0, 500)).toBeCloseTo(20.83, 2);
      expect(calculateMaxShutter(85, 1.6, 500)).toBeCloseTo(3.68, 2);
    });

    it('should calculate correct shutter speed with 400 rule', () => {
      expect(calculateMaxShutter(50, 1.5, 400)).toBeCloseTo(5.33, 2);
      expect(calculateMaxShutter(24, 1.0, 400)).toBeCloseTo(16.67, 2);
      expect(calculateMaxShutter(85, 1.6, 400)).toBeCloseTo(2.94, 2);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateMaxShutter(0, 1.5, 500)).toBeNull();
      expect(calculateMaxShutter(50, 0, 500)).toBeNull();
      expect(calculateMaxShutter(-50, 1.5, 500)).toBeNull();
      expect(calculateMaxShutter(50, -1.5, 500)).toBeNull();
    });
  });

  describe('getCropFactorFromFormat', () => {
    it('should return correct crop factors for known formats', () => {
      expect(getCropFactorFromFormat('Full Frame')).toBe(1.0);
      expect(getCropFactorFromFormat('APS-C')).toBe(1.5);
      expect(getCropFactorFromFormat('APS-C (Canon)')).toBe(1.6);
      expect(getCropFactorFromFormat('Micro Four Thirds')).toBe(2.0);
      expect(getCropFactorFromFormat('Medium Format')).toBe(0.79);
    });

    it('should return 1.0 for unknown formats', () => {
      expect(getCropFactorFromFormat('Unknown Format')).toBe(1.0);
      expect(getCropFactorFromFormat('')).toBe(1.0);
    });
  });

  describe('calculateEffectiveFocalLength', () => {
    it('should calculate correct effective focal length', () => {
      expect(calculateEffectiveFocalLength(50, 1.5)).toBe(75);
      expect(calculateEffectiveFocalLength(24, 1.0)).toBe(24);
      expect(calculateEffectiveFocalLength(35, 2.0)).toBe(70);
      expect(calculateEffectiveFocalLength(85, 1.6)).toBe(136);
    });
  });

  describe('formatShutterFraction', () => {
    it('should format speeds >= 1 second correctly', () => {
      expect(formatShutterFraction(2)).toBe('1/0.5 s');
      expect(formatShutterFraction(10)).toBe('1/0.1 s');
      expect(formatShutterFraction(30)).toBe('1/0.0 s');
    });

    it('should find closest common fraction for speeds < 1 second', () => {
      expect(formatShutterFraction(1/60)).toBe('1/60 s');
      expect(formatShutterFraction(1/125)).toBe('1/125 s');
      expect(formatShutterFraction(1/250)).toBe('1/250 s');
      expect(formatShutterFraction(1/500)).toBe('1/500 s');
      expect(formatShutterFraction(1/1000)).toBe('1/1000 s');
    });

    it('should approximate non-standard speeds', () => {
      expect(formatShutterFraction(1/127)).toBe('1/125 s');
      expect(formatShutterFraction(1/245)).toBe('1/250 s');
      expect(formatShutterFraction(1/495)).toBe('1/500 s');
    });
  });

  describe('parseAperture', () => {
    it('should parse various aperture formats', () => {
      expect(parseAperture('f/2.8')).toBe(2.8);
      expect(parseAperture('f/1.4')).toBe(1.4);
      expect(parseAperture('F/4')).toBe(4);
      expect(parseAperture('2.8')).toBe(2.8);
      expect(parseAperture('f1.8')).toBe(1.8);
      expect(parseAperture('F2')).toBe(2);
    });

    it('should return null for invalid apertures', () => {
      expect(parseAperture('')).toBeNull();
      expect(parseAperture(undefined)).toBeNull();
      expect(parseAperture('invalid')).toBeNull();
    });
  });

  describe('getTrailRisk', () => {
    it('should return low risk for wide angles', () => {
      expect(getTrailRisk(14, 1.0)).toBe('low');
      expect(getTrailRisk(24, 1.0)).toBe('low');
      expect(getTrailRisk(16, 1.5)).toBe('low');
    });

    it('should return medium risk for standard focal lengths', () => {
      expect(getTrailRisk(35, 1.0)).toBe('medium');
      expect(getTrailRisk(50, 1.0)).toBe('medium');
      expect(getTrailRisk(35, 1.5)).toBe('medium');
      expect(getTrailRisk(50, 1.5)).toBe('medium');
    });

    it('should return high risk for telephoto', () => {
      expect(getTrailRisk(85, 1.0)).toBe('high');
      expect(getTrailRisk(135, 1.0)).toBe('high');
      expect(getTrailRisk(200, 1.0)).toBe('high');
      expect(getTrailRisk(70, 1.5)).toBe('high');
    });
  });

  describe('calculatePixelPitch', () => {
    it('should calculate correct pixel pitch for common sensors', () => {
      // Full frame 24MP (36x24mm)
      const ff24mp = calculatePixelPitch(36, 24, 24);
      expect(ff24mp).toBeCloseTo(5.95, 1);

      // APS-C 24MP (23.5x15.6mm)
      const apsc24mp = calculatePixelPitch(23.5, 15.6, 24);
      expect(apsc24mp).toBeCloseTo(3.89, 1);

      // Micro Four Thirds 20MP (17.3x13mm)
      const mft20mp = calculatePixelPitch(17.3, 13, 20);
      expect(mft20mp).toBeCloseTo(3.33, 1);
    });

    it('should handle high resolution sensors', () => {
      // Full frame 61MP
      const ff61mp = calculatePixelPitch(36, 24, 61);
      expect(ff61mp).toBeCloseTo(3.73, 1);

      // Medium format 100MP (44x33mm)
      const mf100mp = calculatePixelPitch(44, 33, 100);
      expect(mf100mp).toBeCloseTo(3.76, 1);
    });
  });

  describe('calculateNPFRule', () => {
    it('should calculate correct NPF shutter speed', () => {
      // f/2.8, 5.95μm pixel pitch, 24mm focal length
      const npf1 = calculateNPFRule(2.8, 5.95, 24, 0);
      expect(npf1).toBeCloseTo(11.5, 1);

      // f/1.4, 3.89μm pixel pitch, 35mm focal length
      const npf2 = calculateNPFRule(1.4, 3.89, 35, 0);
      expect(npf2).toBeCloseTo(4.73, 1);

      // f/2, 3.73μm pixel pitch, 50mm focal length
      const npf3 = calculateNPFRule(2, 3.73, 50, 0);
      expect(npf3).toBeCloseTo(3.64, 1);
    });

    it('should apply declination adjustment', () => {
      const npf0 = calculateNPFRule(2.8, 5.95, 24, 0);
      const npf45 = calculateNPFRule(2.8, 5.95, 24, 45);
      const npf60 = calculateNPFRule(2.8, 5.95, 24, 60);

      expect(npf45).toBeCloseTo(npf0 * Math.cos(45 * Math.PI / 180), 1);
      expect(npf60).toBeCloseTo(npf0 * Math.cos(60 * Math.PI / 180), 1);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateNPFRule(0, 5.95, 24, 0)).toBeNull();
      expect(calculateNPFRule(2.8, 0, 24, 0)).toBeNull();
      expect(calculateNPFRule(2.8, 5.95, 0, 0)).toBeNull();
      expect(calculateNPFRule(-2.8, 5.95, 24, 0)).toBeNull();
    });
  });

  describe('getRecommendedRule', () => {
    it('should recommend NPF for high-res sensors with long focal lengths', () => {
      expect(getRecommendedRule(45, 85, 1.0)).toBe('NPF');
      expect(getRecommendedRule(61, 50, 1.5)).toBe('NPF');
      expect(getRecommendedRule(30, 35, 1.6)).toBe('NPF');
    });

    it('should recommend 400 rule for medium focal lengths', () => {
      expect(getRecommendedRule(20, 50, 1.0)).toBe('400');
      expect(getRecommendedRule(24, 35, 1.5)).toBe('400');
      expect(getRecommendedRule(16, 24, 1.6)).toBe('400');
    });

    it('should recommend 500 rule for wide angles', () => {
      expect(getRecommendedRule(20, 24, 1.0)).toBe('500');
      expect(getRecommendedRule(24, 14, 1.5)).toBe('500');
      expect(getRecommendedRule(30, 16, 1.0)).toBe('500');
    });
  });
});