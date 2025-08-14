import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Navigation2, Info, Layers } from 'lucide-react';

interface DarkSkyLocation {
  lat: number;
  lng: number;
  name: string;
  bortleClass: number;
  description: string;
  distance?: number;
}

interface DarkSkyMapProps {
  userLocation: { lat: number; lng: number };
  onLocationSelect?: (location: DarkSkyLocation) => void;
}

// Mock dark sky locations (in production, this would come from an API)
const DARK_SKY_LOCATIONS: DarkSkyLocation[] = [
  {
    lat: 37.3734,
    lng: -118.4747,
    name: "Death Valley National Park",
    bortleClass: 1,
    description: "One of the darkest skies in North America"
  },
  {
    lat: 31.3315,
    lng: -109.5456,
    name: "Chiricahua National Monument",
    bortleClass: 2,
    description: "Excellent dark skies in Arizona"
  },
  {
    lat: 43.8791,
    lng: -103.4591,
    name: "Badlands National Park",
    bortleClass: 2,
    description: "Pristine night skies in South Dakota"
  },
  {
    lat: 29.2069,
    lng: -103.2355,
    name: "Big Bend National Park",
    bortleClass: 1,
    description: "Darkest measured skies in lower 48 states"
  },
  {
    lat: 38.5733,
    lng: -109.5498,
    name: "Arches National Park",
    bortleClass: 2,
    description: "Stunning dark skies in Utah"
  }
];

// Bortle scale colors
const BORTLE_COLORS = {
  1: '#000033', // Excellent dark sky
  2: '#000055', // Typical dark sky
  3: '#000077', // Rural sky
  4: '#0000AA', // Rural/suburban transition
  5: '#0033CC', // Suburban sky
  6: '#0066FF', // Bright suburban sky
  7: '#3399FF', // Suburban/urban transition
  8: '#66CCFF', // City sky
  9: '#FFFFFF'  // Inner-city sky
};

export function DarkSkyMap({ userLocation, onLocationSelect }: DarkSkyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DarkSkyLocation | null>(null);
  const [showLightPollution, setShowLightPollution] = useState(true);
  const [nearbyLocations, setNearbyLocations] = useState<DarkSkyLocation[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    // Initialize map centered on user location
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 8,
      mapTypeId: 'hybrid',
      styles: [
        {
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }]
        }
      ]
    });

    // Add user location marker
    new google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    });

    // Calculate distances and sort locations
    const locationsWithDistance = DARK_SKY_LOCATIONS.map(loc => ({
      ...loc,
      distance: calculateDistance(userLocation, loc)
    })).sort((a, b) => a.distance - b.distance);

    setNearbyLocations(locationsWithDistance.slice(0, 5));

    // Add dark sky location markers
    locationsWithDistance.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current!,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.STAR,
          scale: 10,
          fillColor: getBortleColor(location.bortleClass),
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #333; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${location.name}</h3>
            <p style="margin: 4px 0; font-size: 14px;">Bortle Class: ${location.bortleClass}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">${location.description}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">Distance: ${location.distance.toFixed(1)} km</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current!, marker);
        setSelectedLocation(location);
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });
    });

    // Add light pollution overlay (simulated)
    if (showLightPollution) {
      addLightPollutionOverlay();
    }

  }, [userLocation, showLightPollution]);

  // Add light pollution heatmap overlay
  const addLightPollutionOverlay = () => {
    if (!mapInstanceRef.current || !window.google?.maps?.visualization) return;

    // Generate simulated light pollution data points
    const heatmapData = generateLightPollutionData(userLocation);

    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstanceRef.current,
      radius: 50,
      opacity: 0.6,
      gradient: [
        'rgba(0, 0, 0, 0)',
        'rgba(0, 0, 50, 0.3)',
        'rgba(0, 0, 100, 0.5)',
        'rgba(50, 50, 150, 0.7)',
        'rgba(100, 100, 200, 0.8)',
        'rgba(150, 150, 255, 0.9)',
        'rgba(255, 255, 255, 1)'
      ]
    });
  };

  // Toggle light pollution overlay
  const toggleLightPollution = () => {
    if (heatmapRef.current) {
      heatmapRef.current.setMap(showLightPollution ? null : mapInstanceRef.current);
    }
    setShowLightPollution(!showLightPollution);
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Dark Sky Locations
        </h3>
        <button
          onClick={toggleLightPollution}
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
            showLightPollution 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-white/10 text-slate-400'
          }`}
        >
          <Layers className="h-4 w-4" />
          Light Pollution
        </button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg overflow-hidden border border-white/20"
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="font-semibold text-white mb-2">Bortle Scale</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BORTLE_COLORS[1] }} />
              <span className="text-slate-300">Class 1-2: Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BORTLE_COLORS[3] }} />
              <span className="text-slate-300">Class 3-4: Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BORTLE_COLORS[5] }} />
              <span className="text-slate-300">Class 5-6: Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BORTLE_COLORS[7] }} />
              <span className="text-slate-300">Class 7-9: Poor</span>
            </div>
          </div>
        </div>

        {/* Your Location Indicator */}
        <div className="absolute top-4 left-4 bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
          <Navigation2 className="h-4 w-4 text-blue-300" />
          <span className="text-xs text-blue-300">Your Location</span>
        </div>
      </div>

      {/* Nearby Dark Sky Locations */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-purple-400" />
          Nearest Dark Sky Sites
        </h4>
        <div className="space-y-2">
          {nearbyLocations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedLocation?.name === location.name
                  ? 'bg-purple-500/20 border-purple-400/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => {
                setSelectedLocation(location);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.panTo({ lat: location.lat, lng: location.lng });
                  mapInstanceRef.current.setZoom(10);
                }
                if (onLocationSelect) {
                  onLocationSelect(location);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm text-white">{location.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{location.description}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">
                      Bortle {location.bortleClass}
                    </span>
                    <span className="text-xs text-slate-500">
                      {location.distance.toFixed(1)} km away
                    </span>
                  </div>
                </div>
                <div 
                  className="w-3 h-3 rounded-full ml-3 mt-1"
                  style={{ backgroundColor: getBortleColor(location.bortleClass) }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
          <div className="text-xs text-blue-300">
            <p className="mb-1">Star markers show designated dark sky locations with minimal light pollution.</p>
            <p>Click on any marker to see details and get directions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calculate distance between two points using Haversine formula
function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get color based on Bortle class
function getBortleColor(bortleClass: number): string {
  return BORTLE_COLORS[bortleClass as keyof typeof BORTLE_COLORS] || BORTLE_COLORS[5];
}

// Generate simulated light pollution data
function generateLightPollutionData(center: { lat: number; lng: number }): google.maps.LatLng[] {
  const points: google.maps.LatLng[] = [];
  
  // Simulate urban areas with higher light pollution
  const urbanCenters = [
    { lat: center.lat + 0.1, lng: center.lng + 0.1, intensity: 10 },
    { lat: center.lat - 0.15, lng: center.lng + 0.05, intensity: 7 },
    { lat: center.lat + 0.05, lng: center.lng - 0.1, intensity: 5 }
  ];

  urbanCenters.forEach(urban => {
    for (let i = 0; i < urban.intensity * 10; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLng = (Math.random() - 0.5) * 0.05;
      points.push(new google.maps.LatLng(
        urban.lat + offsetLat,
        urban.lng + offsetLng
      ));
    }
  });

  return points;
}
