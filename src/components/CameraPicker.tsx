import React from 'react';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, Search, X, ChevronRight } from 'lucide-react';
import { useAppContext, appActions } from '../contexts/AppContext';
import { useSearch } from '../hooks/useSearch';

export function CameraPicker() {
  const { state, dispatch } = useAppContext();
  const { filteredCameras } = useSearch();

  const handleCameraSelect = (camera: any) => {
    dispatch(appActions.setSelectedCamera(camera));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.setCameraSearchTerm(e.target.value));
  };

  const clearSearch = () => {
    dispatch(appActions.setCameraSearchTerm(''));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <CameraIcon className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Select Camera</h2>
      </div>

      {/* Camera Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search cameras... (e.g., Canon R5, Sony A7, etc.)"
            value={state.cameraSearchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
          />
          {state.cameraSearchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {state.cameraSearchTerm && (
          <p className="text-xs text-slate-400 mt-2">
            Found {filteredCameras.length} camera{filteredCameras.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredCameras.map((camera) => (
          <motion.button
            key={camera.id}
            onClick={() => handleCameraSelect(camera)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              state.selectedCamera?.id === camera.id
                ? 'border-blue-400 bg-blue-400/20 text-white'
                : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{camera.brand} {camera.name}</div>
                <div className="text-sm opacity-75">
                  {camera.sensor_format} • {camera.crop_factor}× • {camera.megapixels}MP
                </div>
              </div>
              {state.selectedCamera?.id === camera.id && (
                <ChevronRight className="h-5 w-5 text-blue-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {state.loading && (
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
} 