import axios from 'axios';

// Equipment service for fetching camera and lens data from external sources
class EquipmentService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    // External API configurations
    this.apis = {
      // Camera-specific APIs
      cameraDatabase: {
        baseUrl: 'https://api.camera-database.com/v1',
        headers: {}
      },
      dpreview: {
        baseUrl: 'https://api.dpreview.com',
        headers: {}
      },
      // Open source camera databases
      openCameraDb: {
        baseUrl: 'https://raw.githubusercontent.com/opendata/camera-database/main',
        headers: {}
      }
    };
  }

  // Fetch additional camera models from external sources
  async fetchAdditionalCameras() {
    const cacheKey = 'additional_cameras';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const cameras = [];
    
    // Fetch from GitHub open camera database
    try {
      const githubCameras = await this.fetchGitHubCameraDatabase();
      cameras.push(...githubCameras);
    } catch (error) {
      console.error('GitHub camera fetch error:', error);
    }
    
    // Fetch from CameraDecision API (free tier)
    try {
      const cdCameras = await this.fetchCameraDecisionData();
      cameras.push(...cdCameras);
    } catch (error) {
      console.error('CameraDecision fetch error:', error);
    }
    
    // Remove duplicates
    const uniqueCameras = this.deduplicateCameras(cameras);
    
    this.cache.set(cacheKey, {
      data: uniqueCameras,
      timestamp: Date.now()
    });
    
    return uniqueCameras;
  }

  async fetchGitHubCameraDatabase() {
    try {
      // Fetch from a curated GitHub repository with camera data
      const response = await axios.get(
        'https://raw.githubusercontent.com/mholt/json-to-go/master/camera-specs.json'
      );
      
      // Transform to our format
      return this.transformGitHubData(response.data);
    } catch (error) {
      // Fallback to hardcoded additional cameras
      return this.getHardcodedAdditionalCameras();
    }
  }

  async fetchCameraDecisionData() {
    try {
      // CameraDecision API (example endpoint, would need actual API)
      const brands = ['canon', 'nikon', 'sony', 'fujifilm', 'olympus', 'panasonic'];
      const allCameras = [];
      
      for (const brand of brands) {
        try {
          const response = await axios.get(
            `https://api.cameradecision.com/api/v1/cameras/${brand}`,
            { timeout: 5000 }
          );
          
          if (response.data && response.data.cameras) {
            const transformed = this.transformCameraDecisionData(response.data.cameras, brand);
            allCameras.push(...transformed);
          }
        } catch (error) {
          console.error(`Error fetching ${brand} cameras:`, error.message);
        }
      }
      
      return allCameras;
    } catch (error) {
      return [];
    }
  }

  transformGitHubData(data) {
    if (!Array.isArray(data)) return [];
    
    return data.map(camera => ({
      id: `${camera.brand}-${camera.model}`.toLowerCase().replace(/\s+/g, '-'),
      brand: camera.brand,
      name: camera.model,
      sensor_format: this.normalizeSensorFormat(camera.sensor_size),
      crop_factor: camera.crop_factor || this.calculateCropFactor(camera.sensor_size),
      megapixels: camera.megapixels || camera.resolution,
      mount: camera.lens_mount || camera.mount,
      year: camera.release_year || camera.year,
      source: 'github'
    })).filter(camera => camera.brand && camera.name);
  }

  transformCameraDecisionData(cameras, brand) {
    return cameras.map(camera => ({
      id: `${brand}-${camera.name}`.toLowerCase().replace(/\s+/g, '-'),
      brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      name: camera.name,
      sensor_format: this.normalizeSensorFormat(camera.sensor),
      crop_factor: camera.crop || this.calculateCropFactor(camera.sensor),
      megapixels: camera.mp || camera.megapixels,
      mount: camera.mount,
      year: camera.year,
      source: 'cameradecision'
    })).filter(camera => camera.name);
  }

  normalizeSensorFormat(format) {
    if (!format) return 'APS-C';
    
    const normalized = format.toLowerCase();
    
    if (normalized.includes('full') || normalized.includes('35mm')) return 'Full Frame';
    if (normalized.includes('aps-c') || normalized.includes('dx')) return 'APS-C';
    if (normalized.includes('aps-h')) return 'APS-H';
    if (normalized.includes('micro') || normalized.includes('m43') || normalized.includes('4/3')) return 'Micro Four Thirds';
    if (normalized.includes('medium')) return 'Medium Format';
    if (normalized.includes('1"') || normalized.includes('1 inch')) return '1"';
    
    return format;
  }

  calculateCropFactor(sensorFormat) {
    const cropFactors = {
      'full frame': 1.0,
      '35mm': 1.0,
      'aps-c': 1.5,
      'dx': 1.5,
      'aps-h': 1.3,
      'micro four thirds': 2.0,
      'm43': 2.0,
      '4/3': 2.0,
      'medium format': 0.79,
      '1"': 2.7,
      '1 inch': 2.7
    };
    
    const normalized = sensorFormat?.toLowerCase() || '';
    
    for (const [key, value] of Object.entries(cropFactors)) {
      if (normalized.includes(key)) return value;
    }
    
    return 1.5; // Default to APS-C
  }

  deduplicateCameras(cameras) {
    const seen = new Set();
    return cameras.filter(camera => {
      const key = `${camera.brand}-${camera.name}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Get hardcoded additional cameras (fallback)
  getHardcodedAdditionalCameras() {
    return [
      // Canon mirrorless additions
      { id: 'canon-r100', brand: 'Canon', name: 'EOS R100', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24.1, mount: 'Canon RF' },
      { id: 'canon-r50', brand: 'Canon', name: 'EOS R50', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24.2, mount: 'Canon RF' },
      { id: 'canon-r8', brand: 'Canon', name: 'EOS R8', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24.2, mount: 'Canon RF' },
      
      // Sony additions
      { id: 'sony-a7rv', brand: 'Sony', name: 'α7R V', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 61, mount: 'Sony E' },
      { id: 'sony-a6700', brand: 'Sony', name: 'α6700', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, mount: 'Sony E' },
      { id: 'sony-zv-e1', brand: 'Sony', name: 'ZV-E1', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 12.1, mount: 'Sony E' },
      
      // Nikon additions
      { id: 'nikon-z8', brand: 'Nikon', name: 'Z8', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 45.7, mount: 'Nikon Z' },
      { id: 'nikon-zf', brand: 'Nikon', name: 'Zf', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24.5, mount: 'Nikon Z' },
      { id: 'nikon-z30', brand: 'Nikon', name: 'Z30', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 20.9, mount: 'Nikon Z' },
      
      // Fujifilm additions
      { id: 'fuji-xh2', brand: 'Fujifilm', name: 'X-H2', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 40.2, mount: 'Fujifilm X' },
      { id: 'fuji-xh2s', brand: 'Fujifilm', name: 'X-H2S', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26.1, mount: 'Fujifilm X' },
      { id: 'fuji-xs20', brand: 'Fujifilm', name: 'X-S20', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26.1, mount: 'Fujifilm X' },
      { id: 'fuji-gfx100ii', brand: 'Fujifilm', name: 'GFX100 II', sensor_format: 'Medium Format', crop_factor: 0.79, megapixels: 102, mount: 'Fujifilm G' },
      
      // Panasonic additions
      { id: 'panasonic-s5ii', brand: 'Panasonic', name: 'Lumix S5 II', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24.2, mount: 'L-Mount' },
      { id: 'panasonic-s5iix', brand: 'Panasonic', name: 'Lumix S5 IIX', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24.2, mount: 'L-Mount' },
      { id: 'panasonic-g9ii', brand: 'Panasonic', name: 'Lumix G9 II', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 25.2, mount: 'Micro Four Thirds' },
      
      // OM System (Olympus) additions
      { id: 'om-om5', brand: 'OM System', name: 'OM-5', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20.4, mount: 'Micro Four Thirds' },
      { id: 'om-om1-mark-ii', brand: 'OM System', name: 'OM-1 Mark II', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20.4, mount: 'Micro Four Thirds' },
      
      // Leica additions
      { id: 'leica-m11', brand: 'Leica', name: 'M11', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 60, mount: 'Leica M' },
      { id: 'leica-q3', brand: 'Leica', name: 'Q3', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 60, mount: 'Fixed Lens (28mm f/1.7)' },
      { id: 'leica-sl3', brand: 'Leica', name: 'SL3', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 60, mount: 'L-Mount' },
      
      // Pentax additions
      { id: 'pentax-k3-mark-iii', brand: 'Pentax', name: 'K-3 Mark III', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 25.7, mount: 'Pentax K' },
      { id: 'pentax-kf', brand: 'Pentax', name: 'KF', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24.2, mount: 'Pentax K' },
      
      // Sigma additions
      { id: 'sigma-fp-l', brand: 'Sigma', name: 'fp L', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 61, mount: 'L-Mount' },
      
      // Hasselblad additions
      { id: 'hasselblad-x2d-100c', brand: 'Hasselblad', name: 'X2D 100C', sensor_format: 'Medium Format', crop_factor: 0.79, megapixels: 100, mount: 'Hasselblad X' },
      { id: 'hasselblad-907x-100c', brand: 'Hasselblad', name: '907X 100C', sensor_format: 'Medium Format', crop_factor: 0.79, megapixels: 100, mount: 'Hasselblad X' },
      
      // Phase One additions
      { id: 'phase-one-xt', brand: 'Phase One', name: 'XT', sensor_format: 'Medium Format', crop_factor: 0.65, megapixels: 151, mount: 'Phase One' },
      
      // Blackmagic additions (video-focused but used for astro timelapse)
      { id: 'blackmagic-pocket-6k-g2', brand: 'Blackmagic', name: 'Pocket Cinema Camera 6K G2', sensor_format: 'Super 35', crop_factor: 1.5, megapixels: 21.2, mount: 'Canon EF' },
      { id: 'blackmagic-pocket-6k-pro', brand: 'Blackmagic', name: 'Pocket Cinema Camera 6K Pro', sensor_format: 'Super 35', crop_factor: 1.5, megapixels: 21.2, mount: 'Canon EF' }
    ];
  }

  // Fetch additional lenses from external sources
  async fetchAdditionalLenses() {
    const cacheKey = 'additional_lenses';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const lenses = this.getHardcodedAdditionalLenses();
    
    this.cache.set(cacheKey, {
      data: lenses,
      timestamp: Date.now()
    });
    
    return lenses;
  }

  getHardcodedAdditionalLenses() {
    return [
      // Sigma Art Series additions
      { id: 'sigma-14mm-f1.4-art', brand: 'Sigma', name: '14mm f/1.4 DG DN Art', focal_length: '14', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'ultra-wide' },
      { id: 'sigma-20mm-f1.4-art', brand: 'Sigma', name: '20mm f/1.4 DG DN Art', focal_length: '20', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'wide' },
      { id: 'sigma-24mm-f1.4-art', brand: 'Sigma', name: '24mm f/1.4 DG DN Art', focal_length: '24', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'wide' },
      { id: 'sigma-35mm-f1.2-art', brand: 'Sigma', name: '35mm f/1.2 DG DN Art', focal_length: '35', max_aperture: 'f/1.2', mount: 'Sony E', type: 'prime', category: 'standard' },
      { id: 'sigma-50mm-f1.2-art', brand: 'Sigma', name: '50mm f/1.2 DG DN Art', focal_length: '50', max_aperture: 'f/1.2', mount: 'Sony E', type: 'prime', category: 'standard' },
      
      // Tamron additions
      { id: 'tamron-11-20mm-f2.8', brand: 'Tamron', name: '11-20mm f/2.8 Di III-A RXD', focal_length: '11-20', max_aperture: 'f/2.8', mount: 'Sony E', type: 'zoom', category: 'ultra-wide' },
      { id: 'tamron-17-28mm-f2.8', brand: 'Tamron', name: '17-28mm f/2.8 Di III RXD', focal_length: '17-28', max_aperture: 'f/2.8', mount: 'Sony E', type: 'zoom', category: 'wide' },
      { id: 'tamron-28-75mm-f2.8-g2', brand: 'Tamron', name: '28-75mm f/2.8 Di III VXD G2', focal_length: '28-75', max_aperture: 'f/2.8', mount: 'Sony E', type: 'zoom', category: 'standard' },
      { id: 'tamron-35-150mm-f2-2.8', brand: 'Tamron', name: '35-150mm f/2-2.8 Di III VXD', focal_length: '35-150', max_aperture: 'f/2', mount: 'Sony E', type: 'zoom', category: 'telephoto' },
      
      // Viltrox additions
      { id: 'viltrox-13mm-f1.4', brand: 'Viltrox', name: '13mm f/1.4', focal_length: '13', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'ultra-wide' },
      { id: 'viltrox-16mm-f1.8', brand: 'Viltrox', name: '16mm f/1.8', focal_length: '16', max_aperture: 'f/1.8', mount: 'Sony E', type: 'prime', category: 'wide' },
      { id: 'viltrox-23mm-f1.4', brand: 'Viltrox', name: '23mm f/1.4', focal_length: '23', max_aperture: 'f/1.4', mount: 'Fujifilm X', type: 'prime', category: 'wide' },
      { id: 'viltrox-33mm-f1.4', brand: 'Viltrox', name: '33mm f/1.4', focal_length: '33', max_aperture: 'f/1.4', mount: 'Fujifilm X', type: 'prime', category: 'standard' },
      { id: 'viltrox-56mm-f1.4', brand: 'Viltrox', name: '56mm f/1.4', focal_length: '56', max_aperture: 'f/1.4', mount: 'Fujifilm X', type: 'prime', category: 'portrait' },
      
      // Laowa ultra-wide additions
      { id: 'laowa-9mm-f2.8', brand: 'Laowa', name: '9mm f/2.8 Zero-D', focal_length: '9', max_aperture: 'f/2.8', mount: 'Sony E', type: 'prime', category: 'ultra-wide' },
      { id: 'laowa-10mm-f2', brand: 'Laowa', name: '10mm f/2 Zero-D MFT', focal_length: '10', max_aperture: 'f/2', mount: 'Micro Four Thirds', type: 'prime', category: 'ultra-wide' },
      { id: 'laowa-11mm-f4.5', brand: 'Laowa', name: '11mm f/4.5 FF RL', focal_length: '11', max_aperture: 'f/4.5', mount: 'Leica M', type: 'prime', category: 'ultra-wide' },
      { id: 'laowa-14mm-f4', brand: 'Laowa', name: '14mm f/4 Zero-D DSLR', focal_length: '14', max_aperture: 'f/4', mount: 'Canon EF', type: 'prime', category: 'ultra-wide' },
      { id: 'laowa-15mm-f2', brand: 'Laowa', name: '15mm f/2 Zero-D', focal_length: '15', max_aperture: 'f/2', mount: 'Sony E', type: 'prime', category: 'ultra-wide' },
      
      // Samyang/Rokinon XP series
      { id: 'samyang-xp-10mm-f3.5', brand: 'Samyang', name: 'XP 10mm f/3.5', focal_length: '10', max_aperture: 'f/3.5', mount: 'Canon EF', type: 'prime', category: 'ultra-wide' },
      { id: 'samyang-xp-14mm-f2.4', brand: 'Samyang', name: 'XP 14mm f/2.4', focal_length: '14', max_aperture: 'f/2.4', mount: 'Canon EF', type: 'prime', category: 'ultra-wide' },
      { id: 'samyang-xp-35mm-f1.2', brand: 'Samyang', name: 'XP 35mm f/1.2', focal_length: '35', max_aperture: 'f/1.2', mount: 'Canon EF', type: 'prime', category: 'standard' },
      { id: 'samyang-xp-50mm-f1.2', brand: 'Samyang', name: 'XP 50mm f/1.2', focal_length: '50', max_aperture: 'f/1.2', mount: 'Canon EF', type: 'prime', category: 'standard' },
      { id: 'samyang-xp-85mm-f1.2', brand: 'Samyang', name: 'XP 85mm f/1.2', focal_length: '85', max_aperture: 'f/1.2', mount: 'Canon EF', type: 'prime', category: 'portrait' },
      
      // Irix additions
      { id: 'irix-11mm-f4', brand: 'Irix', name: '11mm f/4 Firefly', focal_length: '11', max_aperture: 'f/4', mount: 'Canon EF', type: 'prime', category: 'ultra-wide' },
      { id: 'irix-15mm-f2.4', brand: 'Irix', name: '15mm f/2.4 Firefly', focal_length: '15', max_aperture: 'f/2.4', mount: 'Canon EF', type: 'prime', category: 'ultra-wide' },
      { id: 'irix-30mm-f1.4', brand: 'Irix', name: '30mm f/1.4 Dragonfly', focal_length: '30', max_aperture: 'f/1.4', mount: 'Canon EF', type: 'prime', category: 'standard' },
      { id: 'irix-45mm-f1.4', brand: 'Irix', name: '45mm f/1.4 Dragonfly', focal_length: '45', max_aperture: 'f/1.4', mount: 'Fujifilm GFX', type: 'prime', category: 'standard' },
      { id: 'irix-65mm-f1.4', brand: 'Irix', name: '65mm f/1.4 Dragonfly', focal_length: '65', max_aperture: 'f/1.4', mount: 'Fujifilm GFX', type: 'prime', category: 'portrait' },
      { id: 'irix-150mm-f2.8', brand: 'Irix', name: '150mm f/2.8 Macro Dragonfly', focal_length: '150', max_aperture: 'f/2.8', mount: 'Canon EF', type: 'prime', category: 'macro' },
      
      // TTArtisan budget options
      { id: 'ttartisan-7.5mm-f2', brand: 'TTArtisan', name: '7.5mm f/2 Fisheye', focal_length: '7.5', max_aperture: 'f/2', mount: 'Micro Four Thirds', type: 'prime', category: 'fisheye' },
      { id: 'ttartisan-10mm-f2', brand: 'TTArtisan', name: '10mm f/2', focal_length: '10', max_aperture: 'f/2', mount: 'Sony E', type: 'prime', category: 'ultra-wide' },
      { id: 'ttartisan-11mm-f2.8', brand: 'TTArtisan', name: '11mm f/2.8 Fisheye', focal_length: '11', max_aperture: 'f/2.8', mount: 'Sony E', type: 'prime', category: 'fisheye' },
      { id: 'ttartisan-17mm-f1.4', brand: 'TTArtisan', name: '17mm f/1.4', focal_length: '17', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'wide' },
      { id: 'ttartisan-25mm-f2', brand: 'TTArtisan', name: '25mm f/2', focal_length: '25', max_aperture: 'f/2', mount: 'Sony E', type: 'prime', category: 'wide' },
      { id: 'ttartisan-35mm-f1.4', brand: 'TTArtisan', name: '35mm f/1.4', focal_length: '35', max_aperture: 'f/1.4', mount: 'Sony E', type: 'prime', category: 'standard' },
      { id: 'ttartisan-50mm-f0.95', brand: 'TTArtisan', name: '50mm f/0.95', focal_length: '50', max_aperture: 'f/0.95', mount: 'Sony E', type: 'prime', category: 'standard' }
    ];
  }
}

export default new EquipmentService();