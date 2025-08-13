import React, { useState, useMemo } from 'react';
import { Calculator, Camera, Layers, Focus, Star, HelpCircle } from 'lucide-react';
import {
  calculateMaxShutter,
  calculateStackingExposures,
  formatShutterSpeed,
  RuleType,
  CameraSpecs,
  LensSpecs
} from '../utils/astrophotography';
import { ErrorBoundary } from './ErrorBoundary';

interface AdvancedCalculatorProps {
  camera: CameraSpecs;
  lens: LensSpecs;
  className?: string;
}

export const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({
  camera,
  lens,
  className = ''
}) => {
  const [selectedRule, setSelectedRule] = useState<RuleType>('500');
  const [targetStackingTime, setTargetStackingTime] = useState(60); // minutes
  const [showTooltips, setShowTooltips] = useState<Record<string, boolean>>({});

  const calculations = useMemo(() => {
    try {
      return calculateMaxShutter(camera, lens, selectedRule);
    } catch (error) {
      // Calculation error - will show error UI
      return null;
    }
  }, [camera, lens, selectedRule]);

  const stackingData = useMemo(() => {
    if (!calculations) return null;
    
    const targetSeconds = targetStackingTime * 60;
    return calculateStackingExposures(targetSeconds, calculations.maxShutterSpeed);
  }, [calculations, targetStackingTime]);

  const toggleTooltip = (key: string) => {
    setShowTooltips(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!calculations) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <p className="text-red-700">
          Unable to calculate exposure settings. Please check your camera and lens parameters.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-blue-600" />
              Advanced Astrophotography Calculator
            </h3>
            <div className="flex space-x-2">
              {(['500', '400', 'npf'] as RuleType[]).map((rule) => (
                <button
                  key={rule}
                  onClick={() => setSelectedRule(rule)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedRule === rule
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rule.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900">Max Exposure</h4>
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {formatShutterSpeed(calculations.maxShutterSpeed)}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {calculations.maxShutterSpeed.toFixed(2)} seconds
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Effective Focal Length</h4>
                <Camera className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {calculations.effectiveFocalLength.toFixed(0)}mm
              </div>
              <div className="text-sm text-gray-600 mt-1">
                35mm equivalent
              </div>
            </div>

            <div className={`border rounded-lg p-4 ${getRiskColor(calculations.trailRisk)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Trail Risk</h4>
                <div className="relative">
                  <button
                    onClick={() => toggleTooltip('trailRisk')}
                    className="text-current hover:opacity-70"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  {showTooltips.trailRisk && (
                    <div className="absolute right-0 top-6 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 z-10">
                      Risk of visible star trails based on focal length and exposure time.
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xl font-bold capitalize">
                {calculations.trailRisk}
              </div>
            </div>
          </div>

          {/* NPF Rule Details */}
          {selectedRule === 'npf' && calculations.details && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                NPF Rule Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-purple-700 font-medium">NPF Factor:</span>
                  <div className="text-purple-800">{calculations.details.npfFactor?.toFixed(1)}</div>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Star Spot Size:</span>
                  <div className="text-purple-800">{calculations.details.starSpotSize?.toFixed(2)}"</div>
                </div>
                <div>
                  <span className="text-purple-700 font-medium">Formula:</span>
                  <div className="text-purple-800 font-mono text-xs">
                    (35×f + 30×p) / (FL×CF)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hyperfocal Distance */}
          {calculations.details?.hyperfocalDistance && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-900 flex items-center">
                  <Focus className="w-5 h-5 mr-2" />
                  Hyperfocal Distance
                </h4>
                <div className="relative">
                  <button
                    onClick={() => toggleTooltip('hyperfocal')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  {showTooltips.hyperfocal && (
                    <div className="absolute right-0 top-6 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 z-10">
                      Focus at this distance to get everything from half this distance to infinity in acceptable focus.
                    </div>
                  )}
                </div>
              </div>
              <div className="text-lg font-bold text-green-800">
                {(calculations.details.hyperfocalDistance / 1000).toFixed(1)}m
              </div>
              <div className="text-sm text-green-700">
                ({calculations.details.hyperfocalDistance.toFixed(0)}mm)
              </div>
            </div>
          )}

          {/* Stacking Calculator */}
          {stackingData && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-amber-900 flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  Exposure Stacking
                </h4>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-amber-700">Target time:</label>
                  <input
                    type="number"
                    value={targetStackingTime}
                    onChange={(e) => setTargetStackingTime(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-sm border border-amber-300 rounded"
                    min="1"
                    max="300"
                  />
                  <span className="text-sm text-amber-700">min</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-amber-700 font-medium">Exposures:</span>
                  <div className="text-amber-800 font-bold">{stackingData.numberOfExposures}</div>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">Each:</span>
                  <div className="text-amber-800 font-bold">
                    {formatShutterSpeed(stackingData.actualSingleExposure)}
                  </div>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">Total time:</span>
                  <div className="text-amber-800 font-bold">
                    {(stackingData.totalTime / 60).toFixed(1)}min
                  </div>
                </div>
                <div>
                  <span className="text-amber-700 font-medium">SNR gain:</span>
                  <div className="text-amber-800 font-bold">
                    {stackingData.snrImprovement.toFixed(1)}×
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formula Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Formula Breakdown</h4>
            <div className="font-mono text-sm text-gray-700">
              {selectedRule === 'npf' && lens.aperture && camera.pixelPitch ? (
                <div>
                  ({35} × {lens.aperture} + {30} × {camera.pixelPitch}) ÷ ({lens.focalLength} × {camera.cropFactor}) = {calculations.maxShutterSpeed.toFixed(2)}s
                </div>
              ) : (
                <div>
                  {selectedRule === '500' ? '500' : '400'} ÷ ({lens.focalLength} × {camera.cropFactor}) = {calculations.maxShutterSpeed.toFixed(2)}s
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};