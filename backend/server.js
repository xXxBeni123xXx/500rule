import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { CAMERA_DATABASE } from './data/cameras.js';
import { LENS_DATABASE } from './data/lenses.js';
import { MOUNT_COMPATIBILITY } from './data/mountCompatibility.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '484e50973amsh5233777f12a5b90p164f19jsn3edff15294e5';

// Middleware
app.use(cors());
app.use(express.json());

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
app.get('/api/cameras', async (req, res) => {
  try {
    // Refresh cache if needed
    if (shouldRefreshCache()) {
      try {
        await updateCacheFromAPI();
      } catch (error) {
        console.warn('API refresh failed, using cached data');
      }
    }
    
    res.json({
      success: true,
      data: cameraCache,
      count: cameraCache.length,
      cached_at: new Date(lastCacheUpdate).toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get lenses (with optional camera_id, brand, or mount filter)
app.get('/api/lenses', async (req, res) => {
  try {
    const { camera_id, brand, mount } = req.query;
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

// Start server and initialize cache
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  await initializeCache();
});

export default app; 