import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { useAppContext, appActions } from '../contexts/AppContext';
import { useCalculations } from '../hooks/useCalculations';

export function ManualMode() {
  const { state, dispatch } = useAppContext();
  const { manualCalculations, hasValidManualCalculation } = useCalculations();

  // Only show when manual tab is active
  if (state.activeTab !== 'manual') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="manual-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Input */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Manual Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Crop Factor Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Crop Factor
                </label>
                <input
                  type="number"
                  value={state.manualCropFactor}
                  onChange={(e) => dispatch(appActions.setManualCropFactor(parseFloat(e.target.value) || 1))}
                  step="0.1"
                  min="0.1"
                  max="10"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                  placeholder="e.g., 1.0 (Full Frame), 1.5 (APS-C), 2.0 (M4/3)"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Full Frame: 1.0, Canon APS-C: 1.6, Sony/Nikon/Fuji APS-C: 1.5, Micro 4/3: 2.0
                </p>
              </div>

              {/* Focal Length Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Focal Length (mm)
                </label>
                <input
                  type="number"
                  value={state.manualFocalLengthParam}
                  onChange={(e) => dispatch(appActions.setManualFocalLengthParam(parseFloat(e.target.value) || 50))}
                  step="1"
                  min="1"
                  max="2000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all"
                  placeholder="e.g., 50, 85, 200"
                />
              </div>

              {/* Rule Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Exposure Rule
                </label>
                <div className="flex gap-2">
                  {[500, 400].map((rule) => (
                    <button
                      key={rule}
                      onClick={() => dispatch(appActions.setManualRule(rule as 500 | 400))}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        state.manualRule === rule
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {rule} Rule
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Manual Results */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Calculated Results</h2>
            </div>

            {hasValidManualCalculation ? (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {manualCalculations.maxShutter.toFixed(2)}s
                    </div>
                    <div className="text-lg text-blue-300">
                      ≈ {manualCalculations.formattedShutter}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Effective Focal Length</div>
                    <div className="text-white font-medium">{manualCalculations.effectiveFocalLength.toFixed(0)}mm</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Rule Applied</div>
                    <div className="text-white font-medium">{state.manualRule} Rule</div>
                  </div>
                </div>

                {/* Trail Risk */}
                <div className={`rounded-lg p-4 border ${
                  manualCalculations.trailRisk === 'low' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                  manualCalculations.trailRisk === 'high' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
                  'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium capitalize">{manualCalculations.trailRisk} Trail Risk</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {manualCalculations.trailRisk === 'low' && 'Stars will appear as sharp points. Perfect for astrophotography.'}
                    {manualCalculations.trailRisk === 'medium' && 'Slight star elongation may be visible. Consider shorter exposures.'}
                    {manualCalculations.trailRisk === 'high' && 'Visible star trails likely. Use shorter exposures or star tracker.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter parameters to see calculated results</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}