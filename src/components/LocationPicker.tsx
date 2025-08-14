import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, Navigation, Map, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Location {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

// Google Maps API loader
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState<Location | null>(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const storedKeys = localStorage.getItem('userApiKeys');
    const userKeys = storedKeys ? JSON.parse(storedKeys) : {};
    // Prefer .env.local value injected at build, else user-provided
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || userKeys.googleMaps;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (window.google?.maps) {
          autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        }
      })
      .catch(err => {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load Google Maps');
      });
  }, []);

  // Initialize map when shown
  useEffect(() => {
    if (showMap && mapRef.current && window.google?.maps && !mapInstanceRef.current) {
      const center = location || { lat: 40.7128, lng: -74.0060 }; // Default to NYC
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 10,
        mapTypeId: 'hybrid', // Satellite view for astronomy
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      placesServiceRef.current = new google.maps.places.PlacesService(mapInstanceRef.current);

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          };
          updateMarker(newLocation);
          reverseGeocode(newLocation);
        }
      });

      // Add initial marker if location exists
      if (location) {
        updateMarker(location);
      }
    }
  }, [showMap, location]);

  // Update marker position
  const updateMarker = (loc: Location) => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition(loc);
    } else {
      markerRef.current = new google.maps.Marker({
        position: loc,
        map: mapInstanceRef.current,
        title: loc.name || 'Selected Location',
        animation: google.maps.Animation.DROP
      });
    }

    mapInstanceRef.current.panTo(loc);
  };

  // Reverse geocode to get address
  const reverseGeocode = async (loc: Location) => {
    if (!window.google?.maps) return;

    const geocoder = new google.maps.Geocoder();
    
    try {
      const result = await geocoder.geocode({ location: loc });
      if (result.results && result.results[0]) {
        const newLocation = {
          ...loc,
          address: result.results[0].formatted_address,
          name: result.results[0].address_components[0]?.long_name || 'Unknown Location'
        };
        setLocation(newLocation);
        onLocationSelect(newLocation);
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    }
  };

  // Get current location
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
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation(newLocation);
        await reverseGeocode(newLocation);
        
        if (mapInstanceRef.current) {
          updateMarker(newLocation);
        }
        
        setIsLoading(false);
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

  // Handle search input
  const handleSearchInput = useCallback(
    debounce((query: string) => {
      if (!query || !autocompleteServiceRef.current) {
        setSuggestions([]);
        return;
      }

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          types: ['geocode']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    }, 300),
    []
  );

  // Handle place selection
  const selectPlace = (placeId: string) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      {
        placeId,
        fields: ['geometry', 'formatted_address', 'name']
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const newLocation: Location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name,
            address: place.formatted_address
          };
          
          setLocation(newLocation);
          onLocationSelect(newLocation);
          updateMarker(newLocation);
          setSuggestions([]);
          setSearchQuery('');
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Location Display */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Location</span>
          </div>
          <div className="flex gap-2">
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
              Current
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMap(!showMap)}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm flex items-center gap-1 transition-colors"
            >
              <Map className="h-4 w-4" />
              Map
            </motion.button>
          </div>
        </div>

        {location ? (
          <div className="text-sm text-slate-300">
            <div className="font-medium">{location.name || 'Selected Location'}</div>
            {location.address && (
              <div className="text-xs text-slate-400 mt-1">{location.address}</div>
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

      {/* Search Bar */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchInput(e.target.value);
                }}
                placeholder="Search for a location..."
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-slate-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => selectPlace(suggestion.place_id)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                  >
                    <div className="text-sm text-white">{suggestion.structured_formatting.main_text}</div>
                    <div className="text-xs text-slate-400">{suggestion.structured_formatting.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Map Container */}
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg overflow-hidden border border-white/20"
              />
              <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-300">
                Click on map to select location
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Extend window type for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}
