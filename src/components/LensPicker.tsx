import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle as LensIcon, Search, X, ChevronRight, Camera as CameraIcon } from 'lucide-react';
import { useAppContext, appActions } from '../contexts/AppContext';
import { useSearch } from '../hooks/useSearch';
import { parseFocalLength } from '../utils/focal';

export function LensPicker() {
  const { state, dispatch } = useAppContext();
  const { filteredLenses } = useSearch();

  const handleLensSelect = (lens: any) => {
    dispatch(appActions.setSelectedLens(lens));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.setLensSearchTerm(e.target.value));
  };

  const clearSearch = () => {
    dispatch(appActions.setLensSearchTerm(''));
  };

  const handleFocalLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.setCurrentFocalLength(parseInt(e.target.value)));
  };

  const handleManualFocalLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    dispatch(appActions.setManualFocalLength(value));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <LensIcon className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Compatible Lenses</h2>
      </div>

      {/* Lens Search - only show when camera is selected */}
      {state.selectedCamera && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lenses... (e.g., 24-70, f/2.8, telephoto, etc.)"
              value={state.lensSearchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            {state.lensSearchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {state.lensSearchTerm && (
            <p className="text-xs text-slate-400 mt-2">
              Found {filteredLenses.length} lens{filteredLenses.length !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!state.selectedCamera ? (
          <motion.div
            key="no-camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-slate-400"
          >
            <CameraIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a camera to see compatible lenses</p>
          </motion.div>
        ) : filteredLenses.length === 0 ? (
          <motion.div
            key="no-lenses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-slate-400"
          >
            <LensIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {state.lensSearchTerm 
                ? `No lenses match "${state.lensSearchTerm}"` 
                : 'No compatible lenses found'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="lenses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 max-h-96 overflow-y-auto"
          >
            {filteredLenses.map((lens) => (
              <motion.button
                key={lens.id}
                onClick={() => handleLensSelect(lens)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  state.selectedLens?.id === lens.id
                    ? 'border-purple-400 bg-purple-400/20 text-white'
                    : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lens.brand} {lens.name}</div>
                    <div className="text-sm opacity-75">
                      {lens.focal_length}mm • {lens.max_aperture} • {lens.category}
                    </div>
                  </div>
                  {state.selectedLens?.id === lens.id && (
                    <ChevronRight className="h-5 w-5 text-purple-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focal Length Controls */}
      <AnimatePresence>
        {state.selectedLens && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-white/20"
          >
            {parseFocalLength(state.selectedLens.focal_length)?.type === 'zoom' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  Focal Length: {state.currentFocalLength}mm
                </label>
                <input
                  type="range"
                  min={parseFocalLength(state.selectedLens.focal_length)?.min || 24}
                  max={parseFocalLength(state.selectedLens.focal_length)?.max || 70}
                  value={state.currentFocalLength}
                  onChange={handleFocalLengthChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">
                Manual Override (mm)
              </label>
              <input
                type="number"
                value={state.manualFocalLength || ''}
                onChange={handleManualFocalLengthChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                placeholder="Custom focal length..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 