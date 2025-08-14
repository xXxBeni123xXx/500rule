import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { CAMERA_DATABASE } from './data/cameras.js';
import { LENS_DATABASE } from './data/lenses.js';
import { MOUNT_COMPATIBILITY } from './data/mountCompatibility.js';
import weatherService from './services/weatherService.js';
import astronomyService from './services/astronomyService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

if (!RAPIDAPI_KEY) {
  console.warn('⚠️ WARNING: RAPIDAPI_KEY is not set. API features will be limited to local data.');
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// In-memory cache
let cameraCache = [];
let lensCache = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// RapidAPI client
const rapidApi = axios.create({
  baseURL: 'https://camera-database.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': 'camera-database.p.rapidapi.com',
  },
});

// Helper function to get compatible lenses for a camera mount
function getCompatibleLenses(cameraMount) {
  const compatibleMounts = MOUNT_COMPATIBILITY[cameraMount] || [];
  
  // Handle fixed lens cameras
  if (cameraMount.startsWith('Fixed Lens')) {
    return [{
      id: 'built-in-lens',
      brand: 'Built-in',
      name: cameraMount.replace('Fixed Lens ', ''),
      mount: cameraMount,
      focal_length: cameraMount.includes('23mm') ? '23' : cameraMount.includes('28mm') ? '28' : 'Various',
      max_aperture: cameraMount.includes('f/2') ? 'f/2' : 'f/1.7',
      type: 'prime',
      category: 'standard',
      is_stabilized: true,
      weight: 0
    }];
  }
  
  return lensCache.filter(lens => 
    compatibleMounts.some(mount => lens.mount === mount)
  );
}

// Check if cache needs refreshing
function shouldRefreshCache() {
  return Date.now() - lastCacheUpdate > CACHE_DURATION;
}

// Initialize cache on startup
async function initializeCache() {
  console.log('🔄 Initializing camera and lens cache...');
  
  try {
    // Try to fetch from RapidAPI first
    await updateCacheFromAPI();
  } catch (error) {
    console.warn('⚠️ API unavailable, using enhanced fallback data');
    cameraCache = CAMERA_DATABASE;
    lensCache = LENS_DATABASE;
  }
  
  lastCacheUpdate = Date.now();
  console.log(`✅ Cache initialized with ${cameraCache.length} cameras and ${lensCache.length} lenses`);
}

// Update cache from RapidAPI
async function updateCacheFromAPI() {
  try {
    // Try to fetch cameras and lenses from API
    const [camerasResponse, lensesResponse] = await Promise.allSettled([
      rapidApi.get('/cameras', { params: { page_size: 100 } }),
      rapidApi.get('/lenses', { params: { page_size: 100 } })
    ]);

    // Process cameras
    if (camerasResponse.status === 'fulfilled' && camerasResponse.value?.data?.items) {
      const apiCameras = camerasResponse.value.data.items.map(camera => ({
        id: camera.id || `${camera.brand}-${camera.name}`.toLowerCase().replace(/\s+/g, '-'),
        brand: camera.brand,
        name: camera.name,
        mount: camera.mount || 'Unknown',
        sensor_format: camera.sensor_format || 'Unknown',
        crop_factor: camera.crop_factor || (camera.sensor_format === 'Full Frame' ? 1.0 : 1.5),
        megapixels: camera.megapixels || 24,
        price_range: camera.price_range || 'Unknown'
      }));
      
      // Merge with enhanced database, preferring API data but keeping enhanced data for missing items
      const combinedCameras = [...apiCameras];
      CAMERA_DATABASE.forEach(enhancedCamera => {
        if (!combinedCameras.find(cam => cam.id === enhancedCamera.id)) {
          combinedCameras.push(enhancedCamera);
        }
      });
      
      cameraCache = combinedCameras;
    } else {
      throw new Error('Camera API unavailable');
    }

    // Process lenses
    if (lensesResponse.status === 'fulfilled' && lensesResponse.value?.data?.items) {
      const apiLenses = lensesResponse.value.data.items.map(lens => ({
        id: lens.id || `${lens.brand}-${lens.name}`.toLowerCase().replace(/\s+/g, '-'),
        brand: lens.brand,
        name: lens.name,
        mount: lens.mount || 'Unknown',
        focal_length: lens.focal_length || 'Unknown',
        max_aperture: lens.max_aperture || 'Unknown',
        type: lens.type || 'Unknown',
        category: lens.category || 'standard',
        is_stabilized: lens.is_stabilized || false,
        weight: lens.weight || 500
      }));
      
      // Merge with enhanced database
      const combinedLenses = [...apiLenses];
      LENS_DATABASE.forEach(enhancedLens => {
        if (!combinedLenses.find(lens => lens.id === enhancedLens.id)) {
          combinedLenses.push(enhancedLens);
        }
      });
      
      lensCache = combinedLenses;
    } else {
      throw new Error('Lens API unavailable');
    }
    
    lastCacheUpdate = Date.now();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
}

// Rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const userRequests = requestCounts.get(ip);
  
  if (now > userRequests.resetTime) {
    userRequests.count = 1;
    userRequests.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }
  
  if (userRequests.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.'
    });
  }
  
  userRequests.count++;
  next();
};

// Input validation middleware
const validateQueryParams = (allowedParams) => {
  return (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));
    
    if (invalidParams.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid query parameters: ${invalidParams.join(', ')}`
      });
    }
    
    // Sanitize string inputs
    for (const key of queryKeys) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim().substring(0, 100);
      }
    }
    
    next();
  };
};

// Apply rate limiting to all routes
app.use(rateLimiter);

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    cameras: cameraCache.length,
    lenses: lensCache.length,
    cache_age: Math.floor((Date.now() - lastCacheUpdate) / 1000 / 60),
    last_updated: new Date(lastCacheUpdate).toISOString()
  });
});

// Get all cameras
app.get('/api/cameras', validateQueryParams(['brand', 'mount', 'sensor_format']), async (req, res) => {
  try {
    // Refresh cache if needed
    if (shouldRefreshCache()) {
      try {
        await updateCacheFromAPI();
      } catch (error) {
        console.warn('API refresh failed, using cached data');
      }
    }
    
    let cameras = [...cameraCache];
    const { brand, mount, sensor_format } = req.query;
    
    // Apply filters
    if (brand) {
      cameras = cameras.filter(c => c.brand?.toLowerCase() === brand.toLowerCase());
    }
    if (mount) {
      cameras = cameras.filter(c => c.mount?.toLowerCase() === mount.toLowerCase());
    }
    if (sensor_format) {
      cameras = cameras.filter(c => c.sensor_format?.toLowerCase() === sensor_format.toLowerCase());
    }
    
    res.json({
      success: true,
      data: cameras,
      count: cameras.length,
      cached_at: new Date(lastCacheUpdate).toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get lenses (with optional camera_id, brand, or mount filter)
app.get('/api/lenses', validateQueryParams(['camera_id', 'brand', 'mount', 'type', 'category']), async (req, res) => {
  try {
    const { camera_id, brand, mount, type, category } = req.query;
    let lenses = [...lensCache];
    
    // Filter by camera compatibility
    if (camera_id) {
      const camera = cameraCache.find(c => c.id === camera_id);
      if (camera && camera.mount) {
        lenses = getCompatibleLenses(camera.mount);
      }
    } else if (mount) {
      lenses = getCompatibleLenses(mount);
    } else if (brand) {
      lenses = lenses.filter(lens => 
        lens.brand && lens.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      data: lenses,
      count: lenses.length,
      cached_at: new Date(lastCacheUpdate).toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get camera brands
app.get('/api/brands', (req, res) => {
  try {
    const brands = [...new Set(cameraCache.map(camera => camera.brand))].sort();
    res.json({
      success: true,
      data: brands,
      count: brands.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get compatibility info for a specific camera
app.get('/api/compatibility/:cameraId', (req, res) => {
  try {
    const { cameraId } = req.params;
    const camera = cameraCache.find(c => c.id === cameraId);
    
    if (!camera) {
      return res.status(404).json({ 
        success: false, 
        error: 'Camera not found' 
      });
    }
    
    const compatibleLenses = getCompatibleLenses(camera.mount);
    
    res.json({
      success: true,
      camera: camera,
      compatible_lenses: compatibleLenses,
      mount_info: {
        mount: camera.mount,
        compatible_mounts: MOUNT_COMPATIBILITY[camera.mount] || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Weather API endpoint
app.get('/api/weather/conditions', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const conditions = await weatherService.getAstronomyConditions(
      parseFloat(lat),
      parseFloat(lon)
    );
    
    res.json({
      success: true,
      data: conditions
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Astronomy API endpoints
app.get('/api/astronomy/sun', async (req, res) => {
  try {
    const { lat, lon, date } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const sunData = await astronomyService.getSunTimes(
      parseFloat(lat),
      parseFloat(lon),
      date ? new Date(date) : new Date()
    );
    
    res.json({
      success: true,
      data: sunData
    });
  } catch (error) {
    console.error('Sun times API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/astronomy/moon', async (req, res) => {
  try {
    const { date } = req.query;
    
    const moonData = await astronomyService.getMoonData(
      date ? new Date(date) : new Date()
    );
    
    res.json({
      success: true,
      data: moonData
    });
  } catch (error) {
    console.error('Moon data API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/astronomy/events', async (req, res) => {
  try {
    const { lat, lon, days } = req.query;
    
    const events = await astronomyService.getCelestialEvents(
      lat ? parseFloat(lat) : 0,
      lon ? parseFloat(lon) : 0,
      days ? parseInt(days) : 30
    );
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Celestial events API error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// NPF Rule calculation endpoint
app.post('/api/calculations/npf', async (req, res) => {
  try {
    const { aperture, pixelPitch, focalLength, declination } = req.body;
    
    if (!aperture || !pixelPitch || !focalLength) {
      return res.status(400).json({
        success: false,
        error: 'Aperture, pixel pitch, and focal length are required'
      });
    }
    
    const result = astronomyService.calculateNPFRule(
      parseFloat(aperture),
      parseFloat(pixelPitch),
      parseFloat(focalLength),
      declination ? parseFloat(declination) : 0
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('NPF calculation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server and initialize cache
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  await initializeCache();
});

export default app; 