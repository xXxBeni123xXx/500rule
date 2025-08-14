import { CAMERA_FORMATS } from '../types/camera';

export type RuleConstant = 500 | 400 | 300 | 200;
export type RuleType = 'simple' | 'npf' | 'simplified';

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

/**
 * NPF Rule calculation (more accurate for modern high-resolution sensors)
 * NPF = (35 × aperture + 30 × pixel pitch) ÷ focal length
 * 
 * @param focalLength - Focal length in mm
 * @param aperture - Aperture f-number (e.g., 2.8 for f/2.8)
 * @param pixelPitch - Pixel pitch in micrometers (μm)
 * @param declination - Declination angle in degrees (optional, default 0)
 */
export function calculateNPFRule(
  focalLength: number,
  aperture: number,
  pixelPitch: number,
  declination: number = 0
): number | null {
  if (!focalLength || !aperture || !pixelPitch || focalLength <= 0 || aperture <= 0 || pixelPitch <= 0) {
    return null;
  }
  
  // Basic NPF formula
  const npf = (35 * aperture + 30 * pixelPitch) / focalLength;
  
  // Apply declination correction (stars move slower near celestial poles)
  const declinationFactor = Math.cos(declination * Math.PI / 180);
  
  return npf / Math.max(declinationFactor, 0.1); // Prevent division by very small numbers
}

/**
 * Simplified Rule (for quick field calculations)
 * Uses a more conservative approach: 300 / (focal length × crop factor)
 */
export function calculateSimplifiedRule(
  focalLength: number,
  cropFactor: number
): number | null {
  if (!focalLength || !cropFactor || focalLength <= 0 || cropFactor <= 0) {
    return null;
  }
  return 300 / (focalLength * cropFactor);
}

/**
 * Calculate pixel pitch from sensor dimensions and resolution
 * @param sensorWidth - Sensor width in mm
 * @param sensorHeight - Sensor height in mm
 * @param megapixels - Total megapixels
 */
export function calculatePixelPitch(
  sensorWidth: number,
  sensorHeight: number,
  megapixels: number
): number | null {
  if (!sensorWidth || !sensorHeight || !megapixels || 
      sensorWidth <= 0 || sensorHeight <= 0 || megapixels <= 0) {
    return null;
  }
  
  const totalPixels = megapixels * 1000000;
  const aspectRatio = sensorWidth / sensorHeight;
  const pixelsHeight = Math.sqrt(totalPixels / aspectRatio);
  const pixelsWidth = pixelsHeight * aspectRatio;
  
  // Calculate pixel pitch in micrometers
  const pixelPitchWidth = (sensorWidth * 1000) / pixelsWidth;
  const pixelPitchHeight = (sensorHeight * 1000) / pixelsHeight;
  
  // Return average pixel pitch
  return (pixelPitchWidth + pixelPitchHeight) / 2;
}

/**
 * Get recommended ISO based on conditions
 */
export function getRecommendedISO(
  aperture: number,
  shutterSpeed: number,
  skyBrightness: 'dark' | 'suburban' | 'urban' = 'dark'
): number {
  const baseISO = skyBrightness === 'dark' ? 3200 : 
                  skyBrightness === 'suburban' ? 1600 : 800;
  
  // Adjust based on aperture (faster aperture = lower ISO needed)
  const apertureMultiplier = Math.pow(aperture / 2.8, 2);
  
  // Adjust based on shutter speed
  const shutterMultiplier = Math.max(10 / shutterSpeed, 0.5);
  
  const recommendedISO = baseISO * apertureMultiplier * shutterMultiplier;
  
  // Round to nearest common ISO value
  const commonISOs = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
  return commonISOs.reduce((prev, curr) => 
    Math.abs(curr - recommendedISO) < Math.abs(prev - recommendedISO) ? curr : prev
  );
} 