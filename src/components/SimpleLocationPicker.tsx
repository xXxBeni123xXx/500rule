import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface Location {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

interface SimpleLocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

// Popular astronomy locations - expanded dataset
const POPULAR_LOCATIONS = [
  // North America
  { name: "Death Valley, CA", lat: 36.5323, lng: -116.9325, address: "Death Valley National Park, California, USA" },
  { name: "Big Bend, TX", lat: 29.2498, lng: -103.2502, address: "Big Bend National Park, Texas, USA" },
  { name: "Cherry Springs, PA", lat: 41.6634, lng: -77.8261, address: "Cherry Springs State Park, Pennsylvania, USA" },
  { name: "Mauna Kea, HI", lat: 19.8207, lng: -155.4681, address: "Mauna Kea, Hawaii, USA" },
  { name: "Bryce Canyon, UT", lat: 37.5930, lng: -112.1871, address: "Bryce Canyon National Park, Utah, USA" },
  { name: "Grand Canyon, AZ", lat: 36.1069, lng: -112.1129, address: "Grand Canyon National Park, Arizona, USA" },
  { name: "Jasper, Canada", lat: 52.8737, lng: -118.0814, address: "Jasper Dark Sky Preserve, Alberta, Canada" },
  { name: "Mont-Mégantic, Canada", lat: 45.4558, lng: -71.1522, address: "Mont-Mégantic Dark Sky Reserve, Quebec, Canada" },
  { name: "Natural Bridges, UT", lat: 37.5847, lng: -110.0100, address: "Natural Bridges National Monument, Utah, USA" },
  { name: "Great Basin, NV", lat: 38.9833, lng: -114.3000, address: "Great Basin National Park, Nevada, USA" },
  
  // Europe
  { name: "La Palma, Spain", lat: 28.7565, lng: -17.8800, address: "Roque de los Muchachos, La Palma, Spain" },
  { name: "Exmoor, UK", lat: 51.1419, lng: -3.6367, address: "Exmoor Dark Sky Reserve, England, UK" },
  { name: "Kerry, Ireland", lat: 51.8503, lng: -10.3520, address: "Kerry International Dark Sky Reserve, Ireland" },
  { name: "Westhavelland, Germany", lat: 52.7080, lng: 12.4580, address: "Westhavelland Nature Park, Germany" },
  { name: "Rhön, Germany", lat: 50.5167, lng: 10.0000, address: "Rhön Biosphere Reserve, Germany" },
  { name: "Alqueva, Portugal", lat: 38.2000, lng: -7.5000, address: "Dark Sky Alqueva, Portugal" },
  
  // Southern Hemisphere
  { name: "Atacama Desert, Chile", lat: -23.0000, lng: -67.7500, address: "Atacama Desert, Chile" },
  { name: "NamibRand, Namibia", lat: -25.2167, lng: 15.9167, address: "NamibRand Nature Reserve, Namibia" },
  { name: "Aoraki Mackenzie, NZ", lat: -43.5950, lng: 170.1420, address: "Aoraki Mackenzie Dark Sky Reserve, New Zealand" },
  { name: "Warrumbungle, Australia", lat: -31.2758, lng: 149.0000, address: "Warrumbungle National Park, NSW, Australia" },
  { name: "River Murray, Australia", lat: -34.0333, lng: 139.5833, address: "River Murray Dark Sky Reserve, South Australia" },
  
  // Asia
  { name: "Ladakh, India", lat: 34.1526, lng: 77.5771, address: "Ladakh, India" },
  { name: "Yeongyang, South Korea", lat: 36.6667, lng: 129.1167, address: "Yeongyang Firefly Eco Park, South Korea" },
  { name: "Ali, Tibet", lat: 32.5000, lng: 80.1000, address: "Ali Dark Sky Park, Tibet" }
];

export function SimpleLocationPicker({ onLocationSelect, initialLocation }: SimpleLocationPickerProps) {
  const [location, setLocation] = useState<Location | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(false);
  const [sortedLocations, setSortedLocations] = useState(POPULAR_LOCATIONS);

  // Sort locations by distance when user location changes
  useEffect(() => {
    if (location && location.lat && location.lng) {
      const sorted = [...POPULAR_LOCATIONS].map(loc => ({
        ...loc,
        distance: calculateDistance(location.lat, location.lng, loc.lat, loc.lng)
      })).sort((a, b) => a.distance - b.distance);
      setSortedLocations(sorted);
    }
  }, [location]);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'Current Location'
        };
        
        setLocation(newLocation);
        onLocationSelect(newLocation);
        setManualLat(position.coords.latitude.toFixed(6));
        setManualLng(position.coords.longitude.toFixed(6));
        setIsLoading(false);

        // Try to get address using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            const updatedLocation = {
              ...newLocation,
              address: data.display_name
            };
            setLocation(updatedLocation);
            onLocationSelect(updatedLocation);
          }
        } catch (err) {
          console.error('Failed to get address:', err);
        }
      },
      (err) => {
        setError(`Failed to get location: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Search for location using Nominatim (OpenStreetMap)
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const newLocation: Location = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.name || searchQuery,
            address: result.display_name
          };
          setLocation(newLocation);
          onLocationSelect(newLocation);
          setManualLat(result.lat);
          setManualLng(result.lon);
        } else {
          setError('Location not found');
        }
      }
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setIsLoading(false);
    }
  };

  // Set location from manual coordinates
  const setManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Invalid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Coordinates out of range');
      return;
    }
    
    const newLocation: Location = {
      lat,
      lng,
      name: 'Manual Location'
    };
    
    setLocation(newLocation);
    onLocationSelect(newLocation);
    setError(null);
  };

  // Select a popular location
  const selectPopularLocation = (popularLoc: typeof POPULAR_LOCATIONS[0]) => {
    const newLocation: Location = {
      lat: popularLoc.lat,
      lng: popularLoc.lng,
      name: popularLoc.name,
      address: popularLoc.address
    };
    setLocation(newLocation);
    onLocationSelect(newLocation);
    setManualLat(popularLoc.lat.toFixed(6));
    setManualLng(popularLoc.lng.toFixed(6));
    setShowPopular(false);
  };

  return (
    <div className="space-y-4">
      {/* Current Location Display */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Location</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm flex items-center gap-1 transition-colors"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Current Location
          </motion.button>
        </div>

        {location ? (
          <div className="text-sm text-slate-300">
            <div className="font-medium">{location.name || 'Selected Location'}</div>
            {location.address && (
              <div className="text-xs text-slate-400 mt-1 line-clamp-2">{location.address}</div>
            )}
            <div className="text-xs text-slate-500 mt-1">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">No location selected</div>
        )}

        {error && (
          <div className="mt-2 text-xs text-red-400">{error}</div>
        )}
      </div>

      {/* Search Location */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400">Search for a location</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              placeholder="City, landmark, or address..."
              className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-sm"
            />
          </div>
          <button
            onClick={searchLocation}
            disabled={isLoading || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {/* Manual Coordinates */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400">Or enter coordinates manually</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="Latitude"
            step="0.000001"
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-sm"
          />
          <input
            type="number"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            placeholder="Longitude"
            step="0.000001"
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-sm"
          />
          <button
            onClick={setManualLocation}
            disabled={!manualLat || !manualLng}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Set
          </button>
        </div>
      </div>

      {/* Popular Dark Sky Locations */}
      <div className="space-y-2">
        <button
          onClick={() => setShowPopular(!showPopular)}
          className="w-full flex items-center justify-between px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg text-sm transition-colors"
        >
          <span>Popular Dark Sky Locations</span>
          <span className="text-xs">{showPopular ? '▼' : '▶'}</span>
        </button>
        
        {showPopular && (
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {sortedLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => selectPopularLocation(loc)}
                className="text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-white">{loc.name}</div>
                    <div className="text-xs text-slate-400">{loc.address}</div>
                  </div>
                  {location && 'distance' in loc && (
                    <div className="text-xs text-slate-500 ml-2">
                      {loc.distance.toFixed(0)} km
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
