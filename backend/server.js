import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { CAMERA_DATABASE } from './data/cameras.js';
import { LENS_DATABASE } from './data/lenses.js';
import { MOUNT_COMPATIBILITY } from './data/mountCompatibility.js';
import externalAPIs from './services/externalAPIs.js';
import openaiService from './services/openaiService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

if (!RAPIDAPI_KEY) {
  console.warn('⚠️ WARNING: RAPIDAPI_KEY is not set. API features will be limited to local data.');
}
if (!OPENWEATHER_API_KEY) {
  console.warn('OpenWeather API key not configured');
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
      
      // Merge with enhanced database and de-duplicate
      const combinedCams = [...apiCameras, ...CAMERA_DATABASE];
      const camMap = new Map();
      for (const c of combinedCams) {
        if (!camMap.has(c.id)) camMap.set(c.id, c);
      }
      cameraCache = Array.from(camMap.values());
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
      
      // Merge with enhanced database and de-duplicate
      const combined = [...apiLenses, ...LENS_DATABASE];
      const lensMap = new Map();
      for (const l of combined) {
        if (!lensMap.has(l.id)) lensMap.set(l.id, l);
      }
      lensCache = Array.from(lensMap.values());
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

// Weather and conditions endpoints
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const weather = await externalAPIs.fetchWeatherData(lat, lon);
    
    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    console.error('Weather endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data'
    });
  }
});

// Moon phase endpoint
app.get('/api/moon-phase', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const moonPhase = await externalAPIs.fetchMoonPhase(targetDate);
    
    res.json({
      success: true,
      data: moonPhase
    });
  } catch (error) {
    console.error('Moon phase endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate moon phase'
    });
  }
});

// Aurora forecast endpoint
app.get('/api/aurora-forecast', async (req, res) => {
  try {
    const forecast = await externalAPIs.fetchAuroraForecast();
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Aurora forecast endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch aurora forecast'
    });
  }
});

// Equipment suggestions endpoint
app.get('/api/equipment-suggestions', async (req, res) => {
  try {
    const suggestions = await externalAPIs.aggregateEquipmentData();
    
    res.json({
      success: true,
      data: suggestions,
      cached_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Equipment suggestions endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment suggestions'
    });
  }
});

// AI-powered tips endpoint (improved with OpenAI service)
app.post('/api/ai/tips', async (req, res) => {
  try {
    const { camera, lens, location, skyConditions, targetObject } = req.body || {};
    
    // Use the new OpenAI service
    const result = await openaiService.generateAstroTips({
      camera,
      lens,
      location,
      skyConditions,
      targetObject
    });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('AI tips error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate AI tips' });
  }
});

// Equipment recommendations endpoint
app.post('/api/ai/equipment-recommendations', async (req, res) => {
  try {
    const result = await openaiService.generateEquipmentRecommendations(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Equipment recommendations error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

// Session planning endpoint
app.post('/api/ai/session-plan', async (req, res) => {
  try {
    const result = await openaiService.generateSessionPlan(req.body);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Session planning error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate session plan' });
  }
});

// Image analysis endpoint
app.post('/api/ai/analyze-image', async (req, res) => {
  try {
    const { imageData, analysisType } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ success: false, error: 'Image data required' });
    }
    
    const result = await openaiService.analyzeImage(imageData, analysisType);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
});

// API configuration status endpoint
app.get('/api/config-status', (req, res) => {
  res.json({
    openai: openaiService.isConfigured(),
    rapidapi: !!RAPIDAPI_KEY,
    openweather: !!OPENWEATHER_API_KEY,
    googleMaps: !!process.env.GOOGLE_MAPS_API_KEY || !!process.env.VITE_GOOGLE_MAPS_API_KEY,
    flickr: !!process.env.FLICKR_API_KEY,
    unsplash: !!process.env.UNSPLASH_ACCESS_KEY
  });
});

// Start server and initialize cache
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  await initializeCache();
});

export default app; 