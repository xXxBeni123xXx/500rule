import { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { parseFocalLength } from '../utils/focal';
import { calculateMaxShutter, formatShutterFraction, getTrailRisk } from '../utils/astro';

export function useCalculations() {
  const { state } = useAppContext();

  // Calculate effective focal length
  const effectiveFocalLength = useMemo(() => {
    if (state.manualFocalLength !== null) {
      return state.manualFocalLength;
    }
    
    if (state.selectedLens) {
      const parsed = parseFocalLength(state.selectedLens.focal_length);
      if (parsed?.type === 'zoom') {
        return state.currentFocalLength;
      }
      return parsed?.min || 50;
    }
    
    return null;
  }, [state.manualFocalLength, state.selectedLens, state.currentFocalLength]);

  // Get crop factor
  const cropFactor = useMemo(() => {
    return state.selectedCamera?.crop_factor || null;
  }, [state.selectedCamera]);

  // Calculate max shutter speed
  const maxShutter = useMemo(() => {
    if (!effectiveFocalLength || !cropFactor) return null;
    return calculateMaxShutter(effectiveFocalLength, cropFactor, state.ruleConstant);
  }, [effectiveFocalLength, cropFactor, state.ruleConstant]);

  // Calculate trail risk
  const trailRisk = useMemo(() => {
    if (!effectiveFocalLength || !cropFactor) return null;
    return getTrailRisk(effectiveFocalLength, cropFactor);
  }, [effectiveFocalLength, cropFactor]);

  // Format shutter speed as fraction
  const formattedShutter = useMemo(() => {
    if (!maxShutter) return null;
    return formatShutterFraction(maxShutter);
  }, [maxShutter]);

  // Manual calculations
  const manualCalculations = useMemo(() => {
    const effectiveFocalLength = state.manualFocalLengthParam * state.manualCropFactor;
    const maxShutter = state.manualRule / effectiveFocalLength;
    const trailRisk = maxShutter > 2 ? 'low' : maxShutter > 1 ? 'medium' : 'high';
    
    return {
      effectiveFocalLength,
      maxShutter,
      trailRisk,
      formattedShutter: maxShutter < 1 ? `1/${Math.round(1/maxShutter)}` : `${maxShutter.toFixed(1)}`,
    };
  }, [state.manualFocalLengthParam, state.manualCropFactor, state.manualRule]);

  return {
    // Guided mode calculations
    effectiveFocalLength,
    cropFactor,
    maxShutter,
    trailRisk,
    formattedShutter,
    
    // Manual mode calculations
    manualCalculations,
    
    // Helper values
    hasValidCalculation: !!(effectiveFocalLength && cropFactor),
    hasValidManualCalculation: !!(state.manualFocalLengthParam && state.manualCropFactor),
  };
}