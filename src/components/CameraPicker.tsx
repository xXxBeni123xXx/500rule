import React from 'react';
import { Camera, CAMERA_FORMATS } from '../types/camera';

type CameraPickerProps = {
  cameras: Camera[] | null;
  selectedCamera: Camera | null;
  selectedFormat: string;
  customCropFactor: number | null;
  onCameraChange: (_camera: Camera | null) => void;
  onFormatChange: (_format: string) => void;
  onCustomCropFactorChange: (_cropFactor: number | null) => void;
  loading?: boolean;
};

export const CameraPicker: React.FC<CameraPickerProps> = ({
  cameras,
  selectedCamera,
  selectedFormat,
  customCropFactor,
  onCameraChange,
  onFormatChange,
  onCustomCropFactorChange,
  loading = false
}) => {
  const handleCustomCropFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onCustomCropFactorChange(isNaN(value) ? null : value);
  };

  // If cameras API is available, show camera dropdown
  if (cameras !== null) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Camera
          </label>
          <select
            value={selectedCamera?.id || ''}
            onChange={(e) => {
              const camera = cameras.find(c => c.id?.toString() === e.target.value) || null;
              onCameraChange(camera);
            }}
            className="select-field"
            disabled={loading}
          >
            <option value="">Choose a camera...</option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.brand} {camera.name}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-sm text-gray-500">Loading cameras...</p>
          )}
        </div>
        
        {selectedCamera && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Format: {selectedCamera.sensor_format || 'Unknown'}
              {selectedCamera.crop_factor && (
                <span className="ml-2">
                  (Crop Factor: {selectedCamera.crop_factor})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Fallback to manual format selection
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Camera Format
        </label>
        <select
          value={selectedFormat}
          onChange={(e) => onFormatChange(e.target.value)}
          className="select-field"
        >
          <option value="">Choose a format...</option>
          {CAMERA_FORMATS.map((format) => (
            <option key={format.name} value={format.name}>
              {format.name} (Crop Factor: {format.cropFactor})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Custom Crop Factor (Optional)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="10"
          value={customCropFactor || ''}
          onChange={handleCustomCropFactorChange}
          className="input-field"
          placeholder="e.g., 1.5"
        />
        <p className="text-xs text-gray-500">
          Leave empty to use the format's default crop factor
        </p>
      </div>
    </div>
  );
}; 