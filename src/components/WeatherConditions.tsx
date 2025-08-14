import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Eye, 
  Droplets, 
  Wind, 
  Thermometer, 
  Moon,
  MapPin,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  conditions: {
    cloudCover: {
      percentage: number;
      description: string;
    };
    visibility: {
      kilometers: number;
      description: string;
    };
    humidity: {
      percentage: number;
      dewPoint: string;
    };
    wind: {
      speed: number;
      description: string;
    };
    temperature: {
      current: number;
      feelsLike: number;
    };
    airQuality: {
      aqi: number;
      description: string;
    };
  };
  astronomy: {
    moonPhase: string;
    moonIllumination: number;
    seeingScore: number;
    recommendation: {
      rating: string;
      message: string;
      icon: string;
    };
  };
}

interface WeatherConditionsProps {
  latitude?: number;
  longitude?: number;
  onLocationRequest?: () => void;
}

export const WeatherConditions: React.FC<WeatherConditionsProps> = ({
  latitude,
  longitude,
  onLocationRequest
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    } else if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [latitude, longitude, useCurrentLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/weather/conditions`, {
        params: { lat, lon }
      });
      
      setWeatherData(response.data.data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeeingScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCloudCoverColor = (percentage: number) => {
    if (percentage <= 20) return 'text-green-400';
    if (percentage <= 40) return 'text-yellow-400';
    if (percentage <= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoonPhaseIcon = (phase: string) => {
    const icons: { [key: string]: string } = {
      'new': '🌑',
      'waxing_crescent': '🌒',
      'first_quarter': '🌓',
      'waxing_gibbous': '🌔',
      'full': '🌕',
      'waning_gibbous': '🌖',
      'last_quarter': '🌗',
      'waning_crescent': '🌘'
    };
    return icons[phase] || '🌙';
  };

  if (!latitude && !longitude && !useCurrentLocation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
      >
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Location Required
          </h3>
          <p className="text-gray-400 mb-4">
            Enable location access to see astronomy conditions for your area
          </p>
          <button
            onClick={() => setUseCurrentLocation(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use My Location
          </button>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="ml-3 text-gray-300">Loading weather data...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-800"
      >
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
          <span className="text-red-300">{error}</span>
        </div>
      </motion.div>
    );
  }

  if (!weatherData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Location Header */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
          </div>
          <div className="text-3xl">{weatherData.astronomy.recommendation.icon}</div>
        </div>
        
        {/* Overall Score */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Astronomy Conditions</span>
            <span className={`text-2xl font-bold ${getSeeingScoreColor(weatherData.astronomy.seeingScore)}`}>
              {weatherData.astronomy.seeingScore}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weatherData.astronomy.seeingScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                weatherData.astronomy.seeingScore >= 80 ? 'bg-green-500' :
                weatherData.astronomy.seeingScore >= 60 ? 'bg-yellow-500' :
                weatherData.astronomy.seeingScore >= 40 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">
            <span className="font-semibold">{weatherData.astronomy.recommendation.rating}:</span>{' '}
            {weatherData.astronomy.recommendation.message}
          </p>
        </div>
      </div>

      {/* Weather Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cloud Cover */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cloud className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Cloud Cover</span>
            </div>
            <span className={`font-bold ${getCloudCoverColor(weatherData.conditions.cloudCover.percentage)}`}>
              {weatherData.conditions.cloudCover.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {weatherData.conditions.cloudCover.description}
          </p>
        </motion.div>

        {/* Visibility */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Visibility</span>
            </div>
            <span className="font-bold text-blue-400">
              {weatherData.conditions.visibility.kilometers.toFixed(1)} km
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {weatherData.conditions.visibility.description}
          </p>
        </motion.div>

        {/* Humidity */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Humidity</span>
            </div>
            <span className="font-bold text-blue-400">
              {weatherData.conditions.humidity.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Dew Point: {weatherData.conditions.humidity.dewPoint}°C
          </p>
        </motion.div>

        {/* Wind */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wind className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Wind</span>
            </div>
            <span className="font-bold text-blue-400">
              {weatherData.conditions.wind.speed.toFixed(1)} m/s
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {weatherData.conditions.wind.description}
          </p>
        </motion.div>

        {/* Temperature */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Temperature</span>
            </div>
            <span className="font-bold text-blue-400">
              {weatherData.conditions.temperature.current.toFixed(1)}°C
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Feels like: {weatherData.conditions.temperature.feelsLike.toFixed(1)}°C
          </p>
        </motion.div>

        {/* Moon Phase */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-300">Moon</span>
            </div>
            <span className="text-2xl">
              {getMoonPhaseIcon(weatherData.astronomy.moonPhase)}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {weatherData.astronomy.moonIllumination}% illuminated
          </p>
        </motion.div>
      </div>

      {/* Air Quality */}
      {weatherData.conditions.airQuality && (
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-300">Air Quality Index</span>
              <p className="text-sm text-gray-400 mt-1">
                {weatherData.conditions.airQuality.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-400">
                {weatherData.conditions.airQuality.aqi}
              </span>
              <p className="text-xs text-gray-400">
                PM2.5: {weatherData.conditions.airQuality.pm25} µg/m³
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};