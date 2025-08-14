import { useState, useEffect } from 'react';
import { Cloud, Moon, Activity, MapPin, Wind, Droplets, Eye, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SimpleLocationPicker } from './SimpleLocationPicker';
// import { DarkSkyMap } from './DarkSkyMap'; // Temporarily disabled until Google Maps API is configured

interface WeatherData {
  cloudCover: number;
  visibility: number;
  humidity: number;
  temperature: number;
  windSpeed: number;
  description: string;
  sunrise?: number;
  sunset?: number;
}

interface MoonPhaseData {
  phase: string;
  illumination: number;
  phaseValue: number;
  date: string;
}

interface AuroraData {
  kpIndex: number;
  visibility: string;
  minLatitude: number;
  timestamp: string;
}

interface AstroConditionsProps {
  latitude?: number;
  longitude?: number;
}

export function AstroConditions({ latitude, longitude }: AstroConditionsProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhaseData | null>(null);
  const [aurora, setAurora] = useState<AuroraData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: latitude || 0, lng: longitude || 0 });
  const [showDarkSkyMap, setShowDarkSkyMap] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(!latitude || !longitude);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchConditions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lng]);

  const fetchConditions = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const [weatherRes, moonRes, auroraRes] = await Promise.allSettled([
        axios.get(`${baseURL}/weather`, {
          params: { lat: location.lat, lon: location.lng }
        }),
        axios.get(`${baseURL}/moon-phase`),
        axios.get(`${baseURL}/aurora-forecast`)
      ]);

      if (weatherRes.status === 'fulfilled') {
        setWeather(weatherRes.value.data.data);
      }
      if (moonRes.status === 'fulfilled') {
        setMoonPhase(moonRes.value.data.data);
      }
      if (auroraRes.status === 'fulfilled') {
        setAurora(auroraRes.value.data.data);
      }
    } catch (error) {
      console.error('Error fetching conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionScore = () => {
    if (!weather || !moonPhase) return 0;
    
    let score = 100;
    
    // Cloud cover impact (0-100%)
    score -= weather.cloudCover * 0.7;
    
    // Moon illumination impact (0-100%)
    score -= moonPhase.illumination * 0.2;
    
    // Humidity impact (high humidity = more haze)
    if (weather.humidity > 80) score -= 10;
    if (weather.humidity > 90) score -= 10;
    
    // Wind speed impact (too much wind = shaky telescope)
    if (weather.windSpeed > 10) score -= 10;
    if (weather.windSpeed > 20) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoonIcon = (phase: string) => {
    const baseClass = "w-8 h-8";
    switch (phase) {
      case 'New Moon':
        return <Moon className={`${baseClass} text-gray-700`} />;
      case 'Full Moon':
        return <Moon className={`${baseClass} text-yellow-300`} />;
      case 'First Quarter':
      case 'Last Quarter':
        return <Moon className={`${baseClass} text-gray-400`} style={{ clipPath: 'inset(0 50% 0 0)' }} />;
      default:
        return <Moon className={`${baseClass} text-gray-500`} />;
    }
  };

  const handleLocationSelect = (newLocation: { lat: number; lng: number; name?: string }) => {
    setLocation(newLocation);
    setShowLocationPicker(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse">Loading conditions...</div>
      </div>
    );
  }

  const score = getConditionScore();

  return (
    <div className="space-y-6">
      {/* Location Picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          Observation Location
        </h3>
        <SimpleLocationPicker 
          onLocationSelect={handleLocationSelect}
          initialLocation={location}
        />
        
        {/* Toggle Dark Sky Map */}
        <button
          onClick={() => setShowDarkSkyMap(!showDarkSkyMap)}
          className="mt-4 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Activity className="h-4 w-4" />
          {showDarkSkyMap ? 'Hide' : 'Show'} Dark Sky Map
        </button>
      </motion.div>

      {/* Dark Sky Map - Temporarily disabled until Google Maps API is configured */}
      {/* {showDarkSkyMap && location.lat && location.lng && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <DarkSkyMap 
            userLocation={location}
            onLocationSelect={(darkSkyLocation) => {
              setLocation({ lat: darkSkyLocation.lat, lng: darkSkyLocation.lng });
            }}
          />
        </motion.div>
      )} */}

      {/* Date/Time Selector */}
      {location.lat && location.lng && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Observation Date & Time
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
            </div>
          </div>
          <button
            onClick={fetchConditions}
            className="mt-3 w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
          >
            Update Conditions
          </button>
        </motion.div>
      )}

      {/* Conditions Display */}
      {location.lat && location.lng && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Astrophotography Conditions</h3>
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score.toFixed(0)}%
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather Card */}
        {weather && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              Weather
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Cloud Cover</span>
                <span className={weather.cloudCover < 30 ? 'text-green-400' : weather.cloudCover < 60 ? 'text-yellow-400' : 'text-red-400'}>
                  {weather.cloudCover}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Visibility
                </span>
                <span>{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> Humidity
                </span>
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Wind className="w-3 h-3" /> Wind
                </span>
                <span>{weather.windSpeed.toFixed(1)} m/s</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 italic">
                {weather.description}
              </div>
            </div>
          </div>
        )}

        {/* Moon Phase Card */}
        {moonPhase && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Moon className="w-4 h-4 text-yellow-400" />
              Moon Phase
            </h4>
            <div className="flex items-center justify-center mb-3">
              {getMoonIcon(moonPhase.phase)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-center font-medium">{moonPhase.phase}</div>
              <div className="flex justify-between">
                <span className="text-gray-400">Illumination</span>
                <span className={moonPhase.illumination < 30 ? 'text-green-400' : moonPhase.illumination < 60 ? 'text-yellow-400' : 'text-orange-400'}>
                  {moonPhase.illumination}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Aurora Forecast Card */}
        {aurora && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              Aurora Forecast
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">KP Index</span>
                <span className={aurora.kpIndex >= 5 ? 'text-green-400' : aurora.kpIndex >= 3 ? 'text-yellow-400' : 'text-gray-400'}>
                  {aurora.kpIndex}/9
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Visibility</span>
                <span>{aurora.visibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Latitude</span>
                <span>{aurora.minLatitude}°</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
        <ul className="text-xs space-y-1 text-gray-300">
          {weather && weather.cloudCover > 50 && (
            <li>• High cloud cover - consider postponing your session</li>
          )}
          {moonPhase && moonPhase.illumination > 70 && (
            <li>• Bright moon - focus on planets or use narrowband filters</li>
          )}
          {weather && weather.windSpeed > 15 && (
            <li>• Strong winds - use a sturdy tripod and consider shorter exposures</li>
          )}
          {aurora && aurora.kpIndex >= 5 && location.lat > aurora.minLatitude && (
            <li className="text-green-400">• Aurora possible at your location!</li>
          )}
          {score >= 80 && (
            <li className="text-green-400">• Excellent conditions for deep-sky imaging!</li>
          )}
        </ul>
      </div>
        </motion.div>
      )}
    </div>
  );
}