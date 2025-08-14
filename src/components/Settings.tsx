import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Eye, EyeOff, Save, X, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiKeys {
  openWeather?: string;
  googleMaps?: string;
  rapidApi?: string;
  flickr?: string;
  unsplash?: string;
  openai?: string;
}

interface ApiStatus {
  openWeather: boolean;
  googleMaps: boolean;
  rapidApi: boolean;
  flickr: boolean;
  unsplash: boolean;
  openai: boolean;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    openWeather: false,
    googleMaps: false,
    rapidApi: false,
    flickr: false,
    unsplash: false,
    openai: false
  });
  const [apiSource, setApiSource] = useState<Record<string, 'backend' | 'user' | 'none'>>({});
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoLocation, setAutoLocation] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedKeys = localStorage.getItem('userApiKeys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedAutoLocation = localStorage.getItem('autoLocation');
    if (savedAutoLocation !== null) {
      setAutoLocation(JSON.parse(savedAutoLocation));
    }

    const savedCacheEnabled = localStorage.getItem('cacheEnabled');
    if (savedCacheEnabled !== null) {
      setCacheEnabled(JSON.parse(savedCacheEnabled));
    }

    // Check API status
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      // Prefer backend config status if available
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${baseURL}/config-status`);
      if (res.ok) {
        const data = await res.json();
        setApiStatus({
          openWeather: !!data.openweather || !!apiKeys.openWeather,
          googleMaps: !!data.googleMaps || !!apiKeys.googleMaps,
          rapidApi: !!data.rapidapi || !!apiKeys.rapidApi,
          flickr: !!data.flickr || !!apiKeys.flickr,
          unsplash: !!data.unsplash || !!apiKeys.unsplash,
          openai: !!data.openai || !!apiKeys.openai,
        });
        setApiSource({
          openWeather: data.openweather ? 'backend' : apiKeys.openWeather ? 'user' : 'none',
          googleMaps: data.googleMaps ? 'backend' : apiKeys.googleMaps ? 'user' : 'none',
          rapidApi: data.rapidapi ? 'backend' : apiKeys.rapidApi ? 'user' : 'none',
          flickr: data.flickr ? 'backend' : apiKeys.flickr ? 'user' : 'none',
          unsplash: data.unsplash ? 'backend' : apiKeys.unsplash ? 'user' : 'none',
          openai: data.openai ? 'backend' : apiKeys.openai ? 'user' : 'none',
        });
        return;
      }
    } catch (e) {
      // fallback to env-only check
    }
    const status: ApiStatus = {
      openWeather: !!import.meta.env.VITE_OPENWEATHER_API_KEY || !!apiKeys.openWeather,
      googleMaps: !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || !!apiKeys.googleMaps,
      rapidApi: !!import.meta.env.VITE_RAPIDAPI_KEY || !!apiKeys.rapidApi,
      flickr: !!import.meta.env.VITE_FLICKR_API_KEY || !!apiKeys.flickr,
      unsplash: !!import.meta.env.VITE_UNSPLASH_ACCESS_KEY || !!apiKeys.unsplash,
      openai: !!import.meta.env.VITE_OPENAI_ENABLED || !!apiKeys.openai
    };
    setApiStatus(status);
    setApiSource({
      openWeather: status.openWeather ? (import.meta.env.VITE_OPENWEATHER_API_KEY ? 'backend' : 'user') : 'none',
      googleMaps: status.googleMaps ? (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'backend' : 'user') : 'none',
      rapidApi: status.rapidApi ? (import.meta.env.VITE_RAPIDAPI_KEY ? 'backend' : 'user') : 'none',
      flickr: status.flickr ? (import.meta.env.VITE_FLICKR_API_KEY ? 'backend' : 'user') : 'none',
      unsplash: status.unsplash ? (import.meta.env.VITE_UNSPLASH_ACCESS_KEY ? 'backend' : 'user') : 'none',
      openai: status.openai ? (import.meta.env.VITE_OPENAI_ENABLED ? 'backend' : 'user') : 'none',
    });
  };

  const handleSaveApiKeys = () => {
    localStorage.setItem('userApiKeys', JSON.stringify(apiKeys));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    checkApiStatus();
    
    // Reload the page to apply new API keys
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('autoLocation', JSON.stringify(autoLocation));
    localStorage.setItem('cacheEnabled', JSON.stringify(cacheEnabled));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getApiKeyValue = (key: keyof ApiKeys): string => {
    // Only show user's keys, not the ones from environment
    return apiKeys[key] || '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* API Keys Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-400" />
                API Keys
              </h3>
              
              <div className="space-y-4">
                {/* OpenWeather API */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300 flex items-center gap-2">
                      OpenWeather API Key
                      <HelpCircle className="h-4 w-4 text-slate-500" title="Get a free key at openweathermap.org (Account → API keys). Add to .env.local as OPENWEATHER_API_KEY or paste here." />
                    </label>
                    <div className="flex items-center gap-2">
                      {apiStatus.openWeather ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {apiStatus.openWeather ? (apiSource.openWeather === 'backend' ? 'using backend apikey' : 'using user apikey') : 'no apikey'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.openWeather ? 'text' : 'password'}
                      value={getApiKeyValue('openWeather')}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, openWeather: e.target.value }))}
                      placeholder="Your OpenWeather API key (optional)"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                    <button
                      onClick={() => toggleShowKey('openWeather')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {showKeys.openWeather ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* Google Maps API */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300 flex items-center gap-2">
                      Google Maps API Key
                      <HelpCircle className="h-4 w-4 text-slate-500" title="Enable Google Maps JavaScript API, Places API, and Geocoding API in Google Cloud Console. Create an API key. Add to .env.local as VITE_GOOGLE_MAPS_API_KEY or paste here." />
                    </label>
                    <div className="flex items-center gap-2">
                      {apiStatus.googleMaps ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {apiStatus.googleMaps ? (apiSource.googleMaps === 'backend' ? 'using backend apikey' : 'using user apikey') : 'no apikey'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.googleMaps ? 'text' : 'password'}
                      value={getApiKeyValue('googleMaps')}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, googleMaps: e.target.value }))}
                      placeholder="Your Google Maps API key (optional)"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                    <button
                      onClick={() => toggleShowKey('googleMaps')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {showKeys.googleMaps ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* RapidAPI */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300 flex items-center gap-2">
                      RapidAPI Key
                      <HelpCircle className="h-4 w-4 text-slate-500" title="Sign up at rapidapi.com and subscribe to a camera database API. Add RAPIDAPI_KEY (backend) and VITE_RAPIDAPI_KEY (frontend) to .env.local or paste here." />
                    </label>
                    <div className="flex items-center gap-2">
                      {apiStatus.rapidApi ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {apiStatus.rapidApi ? (apiSource.rapidApi === 'backend' ? 'using backend apikey' : 'using user apikey') : 'no apikey'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.rapidApi ? 'text' : 'password'}
                      value={getApiKeyValue('rapidApi')}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, rapidApi: e.target.value }))}
                      placeholder="Your RapidAPI key (optional)"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                    <button
                      onClick={() => toggleShowKey('rapidApi')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {showKeys.rapidApi ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* OpenAI Key (for AI tips) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300 flex items-center gap-2">
                      OpenAI API Key
                      <HelpCircle className="h-4 w-4 text-slate-500" title="Get a key from platform.openai.com. Add OPENAI_API_KEY to .env.local (backend) or paste here to enable AI tips." />
                    </label>
                    <div className="flex items-center gap-2">
                      {apiStatus.openai ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {apiStatus.openai ? (apiSource.openai === 'backend' ? 'using backend apikey' : 'using user apikey') : 'no apikey'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={showKeys.openai ? 'text' : 'password'}
                      value={getApiKeyValue('openai')}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                      placeholder="Your OpenAI API key (optional)"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                    <button
                      onClick={() => toggleShowKey('openai')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {showKeys.openai ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSaveApiKeys}
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save API Keys
                </button>
              </div>
            </div>

            {/* General Settings */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
              
              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white">Dark Mode</div>
                    <div className="text-xs text-slate-400">Use dark theme (recommended for night use)</div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>

                {/* Auto Location */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white">Auto-detect Location</div>
                    <div className="text-xs text-slate-400">Automatically get your current location</div>
                  </div>
                  <button
                    onClick={() => setAutoLocation(!autoLocation)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoLocation ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      autoLocation ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>

                {/* Cache */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white">Enable Cache</div>
                    <div className="text-xs text-slate-400">Cache API responses for better performance</div>
                  </div>
                  <button
                    onClick={() => setCacheEnabled(!cacheEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      cacheEnabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      cacheEnabled ? 'translate-x-6' : ''
                    }`} />
                  </button>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>
            </div>

            {/* Status Message */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Settings saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
