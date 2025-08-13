// Enhanced astrophotography calculation utilities
export type RuleType = '500' | '400' | 'npf';

export interface CameraSpecs {
  cropFactor: number;
  pixelPitch?: number; // in micrometers
  sensorWidth?: number; // in mm
  sensorHeight?: number; // in mm
}

export interface LensSpecs {
  focalLength: number;
  aperture?: number;
}

export interface CalculationResult {
  maxShutterSpeed: number;
  effectiveFocalLength: number;
  trailRisk: 'low' | 'medium' | 'high';
  rule: RuleType;
  details?: {
    npfFactor?: number;
    hyperfocalDistance?: number;
    starSpotSize?: number;
  };
}

/**
 * NPF (Natural Photo Finder) Rule Calculator
 * More accurate than 500/400 rule as it accounts for pixel size and aperture
 * Formula: (35 * aperture + 30 * pixelPitch) / (focalLength * cropFactor)
 */
export function calculateNPFRule(
  focalLength: number,
  cropFactor: number,
  aperture: number,
  pixelPitch: number
): number {
  return (35 * aperture + 30 * pixelPitch) / (focalLength * cropFactor);
}

/**
 * Calculate maximum shutter speed using various rules
 */
export function calculateMaxShutter(
  camera: CameraSpecs,
  lens: LensSpecs,
  rule: RuleType = '500'
): CalculationResult {
  const { focalLength, aperture = 2.8 } = lens;
  const { cropFactor, pixelPitch = 4.3 } = camera;
  
  let maxShutterSpeed: number;
  const details: CalculationResult['details'] = {};

  switch (rule) {
    case 'npf':
      if (!pixelPitch) {
        throw new Error('Pixel pitch required for NPF rule');
      }
      maxShutterSpeed = calculateNPFRule(focalLength, cropFactor, aperture, pixelPitch);
      details.npfFactor = 35 * aperture + 30 * pixelPitch;
      details.starSpotSize = (maxShutterSpeed * focalLength * cropFactor) / 206265;
      break;
    case '400':
      maxShutterSpeed = 400 / (focalLength * cropFactor);
      break;
    case '500':
    default:
      maxShutterSpeed = 500 / (focalLength * cropFactor);
      break;
  }

  const effectiveFocalLength = focalLength * cropFactor;
  const trailRisk = getTrailRisk(effectiveFocalLength, maxShutterSpeed);

  // Calculate hyperfocal distance if aperture is provided
  if (aperture) {
    details.hyperfocalDistance = calculateHyperfocalDistance(focalLength, aperture, cropFactor);
  }

  return {
    maxShutterSpeed,
    effectiveFocalLength,
    trailRisk,
    rule,
    details
  };
}

/**
 * Calculate hyperfocal distance for deep sky focusing
 * Formula: (f² / (N * CoC)) + f
 * Where CoC (Circle of Confusion) = 0.03mm for full frame
 */
export function calculateHyperfocalDistance(
  focalLength: number,
  aperture: number,
  cropFactor: number
): number {
  const circleOfConfusion = 0.03 / cropFactor; // Adjust CoC for crop factor
  const focalLengthMm = focalLength;
  
  return (Math.pow(focalLengthMm, 2) / (aperture * circleOfConfusion)) + focalLengthMm;
}

/**
 * Calculate required exposures for stacking
 */
export function calculateStackingExposures(
  totalExposureTime: number,
  maxSingleExposure: number
): {
  numberOfExposures: number;
  actualSingleExposure: number;
  totalTime: number;
  snrImprovement: number;
} {
  const numberOfExposures = Math.ceil(totalExposureTime / maxSingleExposure);
  const actualSingleExposure = totalExposureTime / numberOfExposures;
  const snrImprovement = Math.sqrt(numberOfExposures);
  
  return {
    numberOfExposures,
    actualSingleExposure,
    totalTime: actualSingleExposure * numberOfExposures,
    snrImprovement
  };
}

/**
 * Determine trail risk based on effective focal length and exposure time
 */
export function getTrailRisk(
  effectiveFocalLength: number,
  exposureTime: number
): 'low' | 'medium' | 'high' {
  const trailLength = (effectiveFocalLength * exposureTime) / 206.265; // in arcseconds
  
  if (trailLength < 2) return 'low';
  if (trailLength < 5) return 'medium';
  return 'high';
}

/**
 * Format shutter speed as a fraction for camera settings
 */
export function formatShutterSpeed(seconds: number): string {
  if (seconds >= 1) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const commonFractions = [
    1/4000, 1/3200, 1/2500, 1/2000, 1/1600, 1/1250, 1/1000, 1/800,
    1/640, 1/500, 1/400, 1/320, 1/250, 1/200, 1/160, 1/125,
    1/100, 1/80, 1/60, 1/50, 1/40, 1/30, 1/25, 1/20,
    1/15, 1/13, 1/10, 1/8, 1/6, 1/5, 1/4, 1/3
  ];
  
  let closest = commonFractions[0];
  let minDiff = Math.abs(seconds - closest);
  
  for (const fraction of commonFractions) {
    const diff = Math.abs(seconds - fraction);
    if (diff < minDiff) {
      minDiff = diff;
      closest = fraction;
    }
  }
  
  return `1/${Math.round(1 / closest)}s`;
}

/**
 * Calculate field of view for framing
 */
export function calculateFieldOfView(
  focalLength: number,
  sensorWidth: number,
  sensorHeight: number
): { horizontal: number; vertical: number; diagonal: number } {
  const horizontal = 2 * Math.atan(sensorWidth / (2 * focalLength)) * (180 / Math.PI);
  const vertical = 2 * Math.atan(sensorHeight / (2 * focalLength)) * (180 / Math.PI);
  const diagonal = 2 * Math.atan(Math.sqrt(sensorWidth * sensorWidth + sensorHeight * sensorHeight) / (2 * focalLength)) * (180 / Math.PI);
  
  return { horizontal, vertical, diagonal };
}