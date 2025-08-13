import React from 'react';
import { ParsedFocalLength } from '../types/lens';

type FocalLengthSliderProps = {
  parsedFocalLength: ParsedFocalLength;
  currentFocalLength: number;
  onFocalLengthChange: (focalLength: number) => void;
  manualFocalLength: number | null;
  onManualFocalLengthChange: (focalLength: number | null) => void;
};

export const FocalLengthSlider: React.FC<FocalLengthSliderProps> = ({
  parsedFocalLength,
  currentFocalLength,
  onFocalLengthChange,
  manualFocalLength,
  onManualFocalLengthChange
}) => {
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onManualFocalLengthChange(isNaN(value) ? null : value);
  };

  // If it's a prime lens, just show the focal length
  if (parsedFocalLength.type === 'prime') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Focal Length
        </label>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Prime lens: {parsedFocalLength.min}mm
          </p>
        </div>
      </div>
    );
  }

  // For zoom lenses, show slider and manual input
  const min = parsedFocalLength.min;
  const max = parsedFocalLength.max!;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Focal Length (Zoom Range: {min}mm - {max}mm)
        </label>
        
        <div className="space-y-3">
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={currentFocalLength}
            onChange={(e) => onFocalLengthChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{min}mm</span>
            <span className="font-medium">{currentFocalLength}mm</span>
            <span>{max}mm</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Manual Focal Length Override
        </label>
        <input
          type="number"
          min="1"
          max="2000"
          step="0.1"
          value={manualFocalLength || ''}
          onChange={handleManualChange}
          className="input-field"
          placeholder="Enter custom focal length..."
        />
        <p className="text-xs text-gray-500">
          Override the lens focal length for manual lenses or unlisted focal lengths
        </p>
      </div>
    </div>
  );
}; 