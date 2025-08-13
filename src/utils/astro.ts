import { CAMERA_FORMATS } from '../types/camera';

export type RuleConstant = 500 | 400;

/**
 * Calculate maximum shutter speed using the 500/400 rule
 */
export function calculateMaxShutter(
  focalLength: number,
  cropFactor: number,
  constant: RuleConstant = 500
): number | null {
  if (!focalLength || !cropFactor || focalLength <= 0 || cropFactor <= 0) {
    return null;
  }
  return constant / (focalLength * cropFactor);
}

/**
 * Get crop factor from camera format name
 */
export function getCropFactorFromFormat(formatName: string): number {
  const format = CAMERA_FORMATS.find(f => f.name === formatName);
  return format?.cropFactor || 1.0;
}

/**
 * Calculate effective focal length (35mm equivalent)
 */
export function calculateEffectiveFocalLength(focalLength: number, cropFactor: number): number {
  return focalLength * cropFactor;
}

/**
 * Format shutter speed as a fraction
 * For speeds >= 1s, show as "1/X s"
 * For speeds < 1s, show as nearest common camera fraction
 */
export function formatShutterFraction(seconds: number): string {
  if (seconds >= 1) {
    return `1/${(1 / seconds).toFixed(1)} s`;
  }

  // Common camera shutter speeds (fractions of a second)
  const commonFractions = [
    1/4000, 1/3200, 1/2500, 1/2000, 1/1600, 1/1250, 1/1000, 1/800,
    1/640, 1/500, 1/400, 1/320, 1/250, 1/200, 1/160, 1/125,
    1/100, 1/80, 1/60, 1/50, 1/40, 1/30, 1/25, 1/20,
    1/15, 1/13, 1/10, 1/8, 1/6, 1/5, 1/4, 1/3
  ];

  // Find the closest common fraction
  let closest = commonFractions[0];
  let minDiff = Math.abs(seconds - closest);

  for (const fraction of commonFractions) {
    const diff = Math.abs(seconds - fraction);
    if (diff < minDiff) {
      minDiff = diff;
      closest = fraction;
    }
  }

  const denominator = Math.round(1 / closest);
  return `1/${denominator} s`;
}

/**
 * Parse aperture string to number
 * Handles formats like "f/2.8", "2.8", etc.
 */
export function parseAperture(apertureString?: string): number | null {
  if (!apertureString) return null;
  
  const normalized = apertureString.toLowerCase().replace(/f\/|f/g, '').trim();
  const parsed = parseFloat(normalized);
  
  return isNaN(parsed) ? null : parsed;
}

/**
 * Get a simple trail risk indicator
 */
export function getTrailRisk(focalLength: number, cropFactor: number): 'low' | 'medium' | 'high' {
  const effectiveFocalLength = calculateEffectiveFocalLength(focalLength, cropFactor);
  
  if (effectiveFocalLength <= 24) return 'low';
  if (effectiveFocalLength <= 85) return 'medium';
  return 'high';
} 