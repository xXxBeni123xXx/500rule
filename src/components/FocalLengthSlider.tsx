import React from 'react';

type FocalLengthSliderProps = {
  lens: { focal_length?: string } | null;
  currentFocalLength: number;
  onManualOverride: (_focalLength: number | null) => void;
};

export const FocalLengthSlider: React.FC<FocalLengthSliderProps> = ({
  lens,
  currentFocalLength,
  onManualOverride
}) => {
  // Simple implementation for now - just show current focal length
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Focal Length
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            {currentFocalLength}mm
          </span>
          {lens?.focal_length && lens.focal_length.includes('-') && (
            <span className="text-sm text-gray-500">
              (Range: {lens.focal_length}mm)
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Manual Override (Optional)
        </label>
        <input
          type="number"
          min="1"
          max="2000"
          step="1"
          className="input-field"
          placeholder="Enter focal length..."
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            onManualOverride(isNaN(value) ? null : value);
          }}
        />
        <p className="text-xs text-gray-500">
          Override the lens focal length for custom calculations
        </p>
      </div>
    </div>
  );
}; 