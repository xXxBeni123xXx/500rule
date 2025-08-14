import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CameraIcon, Circle as Lens, Calculator, Star, ChevronRight, Info, Zap, Search, X, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import { Camera, Lens as LensType, fetchCameras, fetchCompatibleLenses } from './services/api';
import { parseFocalLength } from './utils/focal';
import { 
  calculateMaxShutter, 
  formatShutterFraction, 
  getTrailRisk, 
  RuleConstant,
  calculateNPFRule,
  calculatePixelPitch,
  getRecommendedISO
} from './utils/astro';
import { AstroConditions } from './components/AstroConditions';
import { SessionExport } from './components/SessionExport';
import { SmartTips } from './components/SmartTips';
import { Settings } from './components/Settings';

function App() {
  // State management
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedLens, setSelectedLens] = useState<LensType | null>(null);
  const [currentFocalLength, setCurrentFocalLength] = useState(24);
  const [manualFocalLength, setManualFocalLength] = useState<number | null>(null);
  const [ruleConstant, setRuleConstant] = useState<RuleConstant>(500);
  const [ruleType, setRuleType] = useState<'simple' | 'npf'>('simple');
  const [lensAperture, setLensAperture] = useState<number>(2.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search filters
  const [cameraSearchTerm, setCameraSearchTerm] = useState('');
  const [lensSearchTerm, setLensSearchTerm] = useState('');
  
  // Tooltip states
  const [showRuleTooltip, setShowRuleTooltip] = useState(false);
  const [showTrailTooltip, setShowTrailTooltip] = useState(false);
  
  // Tab management
  const [activeTab, setActiveTab] = useState<'guided' | 'manual'>('guided');
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  
  // Manual parameters
  const [manualCropFactor, setManualCropFactor] = useState(1.5);
  const [manualFocalLengthParam, setManualFocalLengthParam] = useState(50);
  const [manualRule, setManualRule] = useState<RuleConstant>(500);
  
  // Data
  const [allCameras, setAllCameras] = useState<Camera[]>([]);
  const [allCompatibleLenses, setAllCompatibleLenses] = useState<LensType[]>([]);
  // Cross-component shared state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [weatherConditions, setWeatherConditions] = useState<any | null>(null);
  const [moonPhase, setMoonPhase] = useState<any | null>(null);
  const [aurora, setAurora] = useState<any | null>(null);

  // Load cameras on mount
  useEffect(() => {
    loadCameras();
  }, []);

  // Load compatible lenses when camera changes
  useEffect(() => {
    if (selectedCamera) {
      loadCompatibleLenses(selectedCamera.id);
    } else {
      setAllCompatibleLenses([]);
      setSelectedLens(null);
    }
  }, [selectedCamera]);

  // Update focal length and aperture when lens changes
  useEffect(() => {
    if (selectedLens) {
      const parsed = parseFocalLength(selectedLens.focal_length);
      if (parsed) {
        setCurrentFocalLength(parsed.min);
      }
      setManualFocalLength(null);
      
      // Update aperture for NPF rule
      if (selectedLens.max_aperture) {
        const aperture = selectedLens.max_aperture.replace(/[^0-9.]/g, '');
        if (aperture) {
          setLensAperture(parseFloat(aperture));
        }
      }
    }
  }, [selectedLens]);

  const loadCameras = async () => {
    try {
      setLoading(true);
      setError(null);
      const cameraData = await fetchCameras();
      setAllCameras(cameraData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cameras');
    } finally {
      setLoading(false);
    }
  };

  const loadCompatibleLenses = async (cameraId: string) => {
    try {
      setLoading(true);
      const lensData = await fetchCompatibleLenses(cameraId);
      setAllCompatibleLenses(lensData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lenses');
    } finally {
      setLoading(false);
    }
  };

  // Advanced search function for cameras
  // De-duplicate cameras by id
  const uniqueCameraMap = new Map<string, Camera>();
  allCameras.forEach((cam) => {
    if (!uniqueCameraMap.has(cam.id)) {
      uniqueCameraMap.set(cam.id, cam);
    }
  });
  const uniqueCameras = Array.from(uniqueCameraMap.values());

  const filteredCameras = uniqueCameras.filter(camera => {
    if (!cameraSearchTerm) return true;
    const searchLower = cameraSearchTerm.toLowerCase().trim();
    
    // Create comprehensive searchable text
    const searchableText = [
      camera.brand,
      camera.name,
      camera.sensor_format,
      `${camera.brand} ${camera.name}`,
      camera.id.replace(/-/g, ' '), // Convert IDs like "sony-a6000" to "sony a6000"
    ].join(' ').toLowerCase();
    
    // Extract numbers from search term for special handling
    const searchNumbers = searchLower.match(/\d+/g) || [];
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
    
    // Check direct substring match (fastest)
    if (searchableText.includes(searchLower)) return true;
    
    // Check if all words are found
    const allWordsFound = searchWords.every(word => searchableText.includes(word));
    
    // Special handling for model numbers (e.g., "a6000", "6000")
    const modelNumberMatches = searchNumbers.some(num => {
      return searchableText.includes(num) || 
             searchableText.includes(`a${num}`) || 
             searchableText.includes(`α${num}`);
    });
    
    return allWordsFound || modelNumberMatches;
  });

  // Advanced search function for lenses
  // De-duplicate lenses by id
  const uniqueLensMap = new Map<string, LensType>();
  allCompatibleLenses.forEach((ln) => {
    if (!uniqueLensMap.has(ln.id)) {
      uniqueLensMap.set(ln.id, ln);
    }
  });
  const uniqueLenses = Array.from(uniqueLensMap.values());

  const filteredLenses = uniqueLenses.filter(lens => {
    if (!lensSearchTerm) return true;
    const searchLower = lensSearchTerm.toLowerCase().trim();
    
    // Create comprehensive searchable text
    const searchableText = [
      lens.brand,
      lens.name,
      lens.focal_length,
      lens.max_aperture,
      lens.category,
      `${lens.brand} ${lens.name}`,
      lens.id.replace(/-/g, ' '),
    ].join(' ').toLowerCase();
    
    // Extract numbers from search (for focal length matching)
    const searchNumbers = searchLower.match(/\d+/g) || [];
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
    
    // Check direct substring match
    if (searchableText.includes(searchLower)) return true;
    
    // Check if all words are found
    const allWordsFound = searchWords.every(word => searchableText.includes(word));
    
    // Special focal length matching (e.g., "12mm" should match "12-24mm")
    const focalLengthMatches = searchNumbers.some(num => {
      const numStr = num.toString();
      // Check if the number appears in focal length ranges
      return lens.focal_length?.includes(numStr) ||
             lens.focal_length?.includes(`${numStr}-`) ||
             lens.focal_length?.includes(`-${numStr}`) ||
             searchableText.includes(`${numStr}mm`);
    });
    
    // Aperture matching (e.g., "f2.8", "2.8")
    const apertureMatches = searchWords.some(word => {
      if (word.startsWith('f')) {
        const aperture = word.substring(1);
        return lens.max_aperture?.includes(aperture);
      }
      if (word.match(/^\d+(\.\d+)?$/)) {
        return lens.max_aperture?.includes(`f/${word}`) || lens.max_aperture?.includes(`f${word}`);
      }
      return false;
    });
    
    return allWordsFound || focalLengthMatches || apertureMatches;
  });

  // Calculate results
  const effectiveFocalLength = manualFocalLength || (selectedLens ? 
    (parseFocalLength(selectedLens.focal_length)?.type === 'zoom' ? currentFocalLength : 
     parseFocalLength(selectedLens.focal_length)?.min || 50) : null);
  
  const cropFactor = selectedCamera?.crop_factor || null;
  
  // Calculate max shutter based on selected rule type
  let maxShutter: number | null = null;
  if (effectiveFocalLength && cropFactor) {
    if (ruleType === 'simple') {
      maxShutter = calculateMaxShutter(effectiveFocalLength, cropFactor, ruleConstant);
    } else if (ruleType === 'npf' && selectedCamera) {
      const pixelPitch = selectedCamera.megapixels && selectedCamera.sensor_width && selectedCamera.sensor_height
        ? calculatePixelPitch(selectedCamera.sensor_width, selectedCamera.sensor_height, selectedCamera.megapixels)
        : 4.3; // Default pixel pitch
      maxShutter = calculateNPFRule(effectiveFocalLength, lensAperture, pixelPitch || 4.3, 0);
    }
  }

  const trailRisk = effectiveFocalLength && cropFactor ? 
    getTrailRisk(effectiveFocalLength, cropFactor) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center py-12">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AstroCalc Pro
            </h1>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto px-4">
            Professional astrophotography exposure calculator with smart camera-lens compatibility
          </p>
          <div className="mt-2 text-sm text-slate-400">
            Version 2.4.0
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <SettingsIcon className="h-5 w-5 text-white" />
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab('guided')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'guided'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📸 Guided Selection
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              ⚙️ Manual Parameters
            </button>
          </div>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-red-400">
              <Info className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        {activeTab === 'guided' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera Selection */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CameraIcon className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Select Camera</h2>
              </div>
              <span className="text-xs text-slate-400">
                {allCameras.length} cameras
              </span>
            </div>

            {/* Camera Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cameras... (e.g., Canon R5, Sony A7, etc.)"
                  value={cameraSearchTerm}
                  onChange={(e) => setCameraSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                {cameraSearchTerm && (
                  <button
                    onClick={() => setCameraSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {cameraSearchTerm && (
                <p className="text-xs text-slate-400 mt-2">
                  Found {filteredCameras.length} camera{filteredCameras.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCameras.map((camera) => (
                <motion.button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedCamera?.id === camera.id
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
                    {selectedCamera?.id === camera.id && (
                      <ChevronRight className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                />
              </div>
            )}
          </motion.div>

          {/* Lens Selection */}
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lens className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Compatible Lenses</h2>
              </div>
              {selectedCamera && (
                <span className="text-xs text-slate-400">
                  {allCompatibleLenses.length} lenses
                </span>
              )}
            </div>

            {/* Lens Search - only show when camera is selected */}
            {selectedCamera && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search lenses... (e.g., 24-70, f/2.8, telephoto, etc.)"
                    value={lensSearchTerm}
                    onChange={(e) => setLensSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                  {lensSearchTerm && (
                    <button
                      onClick={() => setLensSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {lensSearchTerm && (
                  <p className="text-xs text-slate-400 mt-2">
                    Found {filteredLenses.length} lens{filteredLenses.length !== 1 ? 'es' : ''}
                  </p>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              {!selectedCamera ? (
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
                  <Lens className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {lensSearchTerm 
                      ? `No lenses match "${lensSearchTerm}"` 
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
                      onClick={() => setSelectedLens(lens)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedLens?.id === lens.id
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
                        {selectedLens?.id === lens.id && (
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
              {selectedLens && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-white/20"
                >
                  {parseFocalLength(selectedLens.focal_length)?.type === 'zoom' && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white">
                        Focal Length: {currentFocalLength}mm
                      </label>
                      <input
                        type="range"
                        min={parseFocalLength(selectedLens.focal_length)?.min || 24}
                        max={parseFocalLength(selectedLens.focal_length)?.max || 70}
                        value={currentFocalLength}
                        onChange={(e) => setCurrentFocalLength(parseInt(e.target.value))}
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
                      value={manualFocalLength || ''}
                      onChange={(e) => setManualFocalLength(e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400"
                      placeholder="Custom focal length..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">500-Rule Results</h2>
            </div>

            <AnimatePresence mode="wait">
              {!effectiveFocalLength || !cropFactor ? (
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
                  {/* Rule Type Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-300">Calculation Method</span>
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowRuleTooltip(true)}
                          onMouseLeave={() => setShowRuleTooltip(false)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                        {showRuleTooltip && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 p-4 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 z-10">
                            <div className="space-y-3">
                              <div>
                                <strong className="text-blue-300">Simple Rules (500/400/300/200):</strong>
                                <div className="mt-1 text-slate-300">Traditional rules based on focal length and crop factor. Easy to remember and calculate in the field.</div>
                                <div className="mt-1 text-slate-400">• 500: Best for wide angle (14-35mm)</div>
                                <div className="text-slate-400">• 400: Good for normal lenses (35-85mm)</div>
                                <div className="text-slate-400">• 300/200: For telephoto lenses (&gt;85mm)</div>
                              </div>
                              <div>
                                <strong className="text-purple-300">NPF Rule (Recommended):</strong>
                                <div className="mt-1 text-slate-300">Most accurate for modern high-resolution sensors. Accounts for aperture, pixel density, and optical characteristics.</div>
                                <div className="mt-1 text-slate-400">Formula: (35 × aperture + 30 × pixel pitch) ÷ focal length</div>
                                <div className="mt-1 text-green-400">✓ Best for cameras with 20+ megapixels</div>
                                <div className="text-green-400">✓ Prevents pixel-level star trails</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Rule Type Tabs */}
                    <div className="flex gap-2 mb-3">
                      {(['simple', 'npf'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setRuleType(type)}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                            ruleType === type
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {type === 'simple' ? 'Simple Rules' : 'NPF Rule'}
                        </button>
                      ))}
                    </div>
                    
                  {/* Simple Rules Options */}
                  {ruleType === 'simple' && (
                    <div className="grid grid-cols-4 gap-2">
                      {([500, 400, 300, 200] as const).map((rule) => (
                        <button
                          key={rule}
                          onClick={() => setRuleConstant(rule)}
                          className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                            ruleConstant === rule
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {rule}
                        </button>
                      ))}
                    </div>
                  )}
                    
                    {/* NPF Rule Inputs */}
                    {ruleType === 'npf' && selectedLens && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-400">Aperture (f-stop)</label>
                          <input
                            type="number"
                            value={lensAperture}
                            onChange={(e) => setLensAperture(parseFloat(e.target.value) || 2.8)}
                            step="0.1"
                            min="1"
                            max="22"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                            placeholder="e.g., 2.8"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {maxShutter?.toFixed(2)}s
                      </div>
                      <div className="text-lg text-blue-300">
                        ≈ {maxShutter ? formatShutterFraction(maxShutter) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Formula */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-slate-300 mb-1">Formula:</div>
                    <div className="font-mono text-white text-sm">
                      {ruleType === 'simple' && (
                        <>{ruleConstant} ÷ ({effectiveFocalLength}mm × {cropFactor}) = {maxShutter?.toFixed(2)}s</>
                      )}
                      {ruleType === 'npf' && selectedCamera && (
                        <>
                          NPF = (35 × {lensAperture} + 30 × {
                            selectedCamera.megapixels && selectedCamera.sensor_width && selectedCamera.sensor_height
                              ? (calculatePixelPitch(selectedCamera.sensor_width, selectedCamera.sensor_height, selectedCamera.megapixels) || 4.3).toFixed(1)
                              : '4.3'
                          }μm) ÷ {effectiveFocalLength}mm = {maxShutter?.toFixed(2)}s
                        </>
                      )}
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
                            onMouseEnter={() => setShowTrailTooltip(true)}
                            onMouseLeave={() => setShowTrailTooltip(false)}
                            className="text-current opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                          {showTrailTooltip && (
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
                        {(effectiveFocalLength * cropFactor).toFixed(0)}mm
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
          </motion.div>
          </div>
        ) : (
          // Manual Parameters Tab
          <div className="max-w-4xl mx-auto">
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
                      value={manualCropFactor}
                      onChange={(e) => setManualCropFactor(parseFloat(e.target.value) || 1)}
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
                      value={manualFocalLengthParam}
                      onChange={(e) => setManualFocalLengthParam(parseFloat(e.target.value) || 50)}
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
                    <div className="grid grid-cols-4 gap-2">
                      {[500, 400, 300, 200].map((rule) => (
                        <button
                          key={rule}
                          onClick={() => setManualRule(rule as RuleConstant)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            manualRule === (rule as RuleConstant)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {rule} Rule
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      500/400: wide to normal lenses; 300/200: telephoto, more conservative.
                    </p>
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

                {(() => {
                  const effectiveFocalLength = manualFocalLengthParam * manualCropFactor;
                  const maxShutter = manualRule / effectiveFocalLength;
                  const trailRisk = maxShutter > 2 ? 'low' : maxShutter > 1 ? 'medium' : 'high';
                  
                  return (
                    <div className="space-y-6">
                      {/* Main Result */}
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-2">
                            {maxShutter.toFixed(2)}s
                          </div>
                          <div className="text-lg text-blue-300">
                            ≈ {maxShutter < 1 ? `1/${Math.round(1/maxShutter)}` : `${maxShutter.toFixed(1)}`}s
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-slate-400">Effective Focal Length</div>
                          <div className="text-white font-medium">{effectiveFocalLength.toFixed(0)}mm</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-slate-400">Rule Applied</div>
                          <div className="text-white font-medium">{manualRule} Rule</div>
                        </div>
                      </div>

                      {/* Trail Risk */}
                      <div className={`rounded-lg p-4 border ${
                        trailRisk === 'low' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                        trailRisk === 'medium' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                        'bg-red-500/20 border-red-400/30 text-red-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5" />
                          <span className="font-medium capitalize">{trailRisk} Trail Risk</span>
                        </div>
                        <div className="text-xs opacity-90">
                          {trailRisk === 'low' && 'Stars will appear as sharp points. Perfect for astrophotography.'}
                          {trailRisk === 'medium' && 'Slight star elongation may be visible. Consider shorter exposures.'}
                          {trailRisk === 'high' && 'Visible star trails likely. Use shorter exposures or star tracker.'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          </div>
        )}

        {/* New Features Section */}
        <div className="mt-12 space-y-8">
          {/* First Row: Astro Conditions and Session Export */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Astro Conditions */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <AstroConditions 
                onLocationChange={(loc) => setUserLocation({ lat: loc.lat, lng: loc.lng })}
                onConditionsChange={(data) => {
                  setWeatherConditions(data.weather || null);
                  setMoonPhase(data.moonPhase || null);
                  setAurora(data.aurora || null);
                }}
              />
            </motion.div>

            {/* Session Export */}
            {(selectedCamera && selectedLens && effectiveFocalLength && cropFactor) && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                  <SessionExport 
                    sessionData={{
                      camera: selectedCamera,
                      lens: selectedLens,
                      focalLength: effectiveFocalLength,
                      shutterSpeed: maxShutter,
                      ruleConstant: activeTab === 'guided' ? ruleConstant : manualRule,
                      trailRisk: trailRisk || 'unknown',
                      conditions: weatherConditions || moonPhase || aurora ? {
                        weather: weatherConditions || undefined,
                        moonPhase: moonPhase || undefined,
                        aurora: aurora || undefined
                      } : undefined
                    }}
                  />
              </motion.div>
            )}
          </div>

          {/* Second Row: Smart Tips */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <SmartTips 
              focalLength={effectiveFocalLength || undefined}
              cropFactor={cropFactor || undefined}
              currentCamera={selectedCamera || undefined}
              currentLens={selectedLens || undefined}
              maxShutter={maxShutter}
              trailRisk={trailRisk}
              weatherConditions={weatherConditions || undefined}
              moonPhase={moonPhase || undefined}
              location={userLocation || undefined}
            />
          </motion.div>
        </div>
      </main>
      
      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default App; 