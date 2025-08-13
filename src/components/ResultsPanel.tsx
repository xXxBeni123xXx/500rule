import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Zap, HelpCircle } from 'lucide-react';
import { useAppContext, appActions } from '../contexts/AppContext';
import { useCalculations } from '../hooks/useCalculations';

export function ResultsPanel() {
  const { state, dispatch } = useAppContext();
  const { 
    effectiveFocalLength, 
    cropFactor, 
    maxShutter, 
    trailRisk, 
    formattedShutter,
    hasValidCalculation 
  } = useCalculations();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-green-400" />
        <h2 className="text-xl font-semibold text-white">500-Rule Results</h2>
      </div>

      <AnimatePresence mode="wait">
        {!hasValidCalculation ? (
          <motion.div
            key="no-calculation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-slate-400"
          >
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select camera and lens to calculate exposure time</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Rule Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Exposure Rule</span>
                <div className="relative">
                  <button
                    onMouseEnter={() => dispatch(appActions.setShowRuleTooltip(true))}
                    onMouseLeave={() => dispatch(appActions.setShowRuleTooltip(false))}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  {state.showRuleTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 z-10">
                      <div className="mb-2"><strong>500 Rule:</strong> Conservative, minimizes star trails</div>
                      <div><strong>400 Rule:</strong> Shorter exposures, better for longer focal lengths</div>
                      <div className="mt-2 text-slate-400">Formula: Rule ÷ (focal length × crop factor)</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {[500, 400].map((rule) => (
                  <button
                    key={rule}
                    onClick={() => dispatch(appActions.setRuleConstant(rule as 500 | 400))}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      state.ruleConstant === rule
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {rule} Rule
                  </button>
                ))}
              </div>
            </div>

            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {maxShutter?.toFixed(2)}s
                </div>
                <div className="text-lg text-blue-300">
                  ≈ {formattedShutter || 'N/A'}
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-slate-300 mb-1">Formula:</div>
              <div className="font-mono text-white">
                {state.ruleConstant} ÷ ({effectiveFocalLength}mm × {cropFactor}) = {maxShutter?.toFixed(2)}s
              </div>
            </div>

            {/* Trail Risk */}
            {trailRisk && (
              <div className={`rounded-lg p-4 border ${
                trailRisk === 'low' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                trailRisk === 'medium' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                'bg-red-500/20 border-red-400/30 text-red-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium capitalize">{trailRisk} Trail Risk</span>
                  <div className="relative ml-auto">
                    <button
                      onMouseEnter={() => dispatch(appActions.setShowTrailTooltip(true))}
                      onMouseLeave={() => dispatch(appActions.setShowTrailTooltip(false))}
                      className="text-current opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                    {state.showTrailTooltip && (
                      <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 z-10">
                        <div className="mb-2"><strong>Star Trail Risk Assessment:</strong></div>
                        <div className="space-y-1">
                          <div><span className="text-green-400">Low:</span> Perfect sharp stars, ideal exposure time</div>
                          <div><span className="text-yellow-400">Medium:</span> Minor elongation possible, still acceptable</div>
                          <div><span className="text-red-400">High:</span> Visible trails likely, consider star tracker or shorter exposure</div>
                        </div>
                        <div className="mt-2 text-slate-400 text-xs">Based on focal length, crop factor, and Earth's rotation</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-90">
                  {trailRisk === 'low' && 'Stars will appear as sharp points. Perfect for astrophotography.'}
                  {trailRisk === 'medium' && 'Slight star elongation may be visible. Consider shorter exposures.'}
                  {trailRisk === 'high' && 'Visible star trails likely. Use shorter exposures or star tracker.'}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-slate-400">Effective FL</div>
                <div className="text-white font-medium">
                  {(effectiveFocalLength! * cropFactor!).toFixed(0)}mm
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-slate-400">Crop Factor</div>
                <div className="text-white font-medium">{cropFactor}×</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}