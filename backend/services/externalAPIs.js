import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Service for fetching camera and lens data from external APIs
class ExternalAPIService {
  constructor() {
    this.flickrApiKey = process.env.FLICKR_API_KEY || '';
    this.unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY || '';
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY || '';
    this.lpmapApiKey = process.env.LPMAP_API_KEY || '';
  }

  /**
   * Fetch camera EXIF data from Flickr
   * This can help identify popular camera/lens combinations
   */
  async fetchFlickrCameraData(tag = 'astrophotography', limit = 100) {
    if (!this.flickrApiKey) {
      console.warn('Flickr API key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://api.flickr.com/services/rest/', {
        params: {
          method: 'flickr.photos.search',
          api_key: this.flickrApiKey,
          tags: tag,
          extras: 'camera,lens,exif',
          per_page: limit,
          format: 'json',
          nojsoncallback: 1
        }
      });

      const photos = response.data.photos?.photo || [];
      const cameraData = new Map();

      for (const photo of photos) {
        // Get detailed EXIF data for each photo
        const exifResponse = await axios.get('https://api.flickr.com/services/rest/', {
          params: {
            method: 'flickr.photos.getExif',
            api_key: this.flickrApiKey,
            photo_id: photo.id,
            format: 'json',
            nojsoncallback: 1
          }
        });

        if (exifResponse.data.photo?.exif) {
          const exif = exifResponse.data.photo.exif;
          const camera = exif.find(e => e.tag === 'Model')?.raw?._content;
          const lens = exif.find(e => e.tag === 'LensModel')?.raw?._content;
          const focalLength = exif.find(e => e.tag === 'FocalLength')?.raw?._content;
          const aperture = exif.find(e => e.tag === 'FNumber')?.raw?._content;

          if (camera) {
            const key = `${camera}_${lens || 'unknown'}`;
            if (!cameraData.has(key)) {
              cameraData.set(key, {
                camera,
                lens,
                focalLength,
                aperture,
                count: 1
              });
            } else {
              cameraData.get(key).count++;
            }
          }
        }
      }

      return Array.from(cameraData.values());
    } catch (error) {
      console.error('Error fetching Flickr data:', error);
      return [];
    }
  }

  /**
   * Fetch photography locations and conditions from Unsplash
   */
  async fetchUnsplashPhotoData(query = 'milky way', perPage = 30) {
    if (!this.unsplashApiKey) {
      console.warn('Unsplash API key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        headers: {
          Authorization: `Client-ID ${this.unsplashApiKey}`
        },
        params: {
          query,
          per_page: perPage
        }
      });

      return response.data.results.map(photo => ({
        id: photo.id,
        location: photo.location,
        exif: photo.exif,
        description: photo.description,
        tags: photo.tags
      }));
    } catch (error) {
      console.error('Error fetching Unsplash data:', error);
      return [];
    }
  }

  /**
   * Fetch weather conditions for astrophotography planning
   */
  async fetchWeatherData(lat, lon) {
    try {
      // Prefer OpenWeather if configured
      if (this.openWeatherApiKey) {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat,
            lon,
            appid: this.openWeatherApiKey,
            units: 'metric'
          }
        });

        const data = response.data;
        return {
          cloudCover: data.clouds?.all || 0,
          visibility: data.visibility || 10000,
          humidity: data.main?.humidity || 0,
          temperature: data.main?.temp || 0,
          windSpeed: data.wind?.speed || 0,
          description: data.weather?.[0]?.description || '',
          sunrise: data.sys?.sunrise,
          sunset: data.sys?.sunset
        };
      }

      // Fallback: Open-Meteo (no API key required)
      console.warn('OpenWeather API key not configured. Falling back to Open-Meteo.');
      const omResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly: 'cloudcover,relativehumidity_2m,visibility,windspeed_10m',
          timezone: 'auto'
        }
      });

      const om = omResponse.data;
      const idx = 0;
      const current = om.current_weather || {};
      const hourly = om.hourly || {};

      const cloudCover = Array.isArray(hourly.cloudcover) ? hourly.cloudcover[idx] : 0;
      const humidity = Array.isArray(hourly.relativehumidity_2m) ? hourly.relativehumidity_2m[idx] : 0;
      const visibility = Array.isArray(hourly.visibility) ? hourly.visibility[idx] : 10000;
      const windSpeed = current.windspeed ?? (Array.isArray(hourly.windspeed_10m) ? hourly.windspeed_10m[idx] : 0);
      const temperature = current.temperature ?? 0;

      return {
        cloudCover: typeof cloudCover === 'number' ? Math.round(cloudCover) : 0,
        visibility: typeof visibility === 'number' ? visibility : 10000,
        humidity: typeof humidity === 'number' ? Math.round(humidity) : 0,
        temperature: typeof temperature === 'number' ? temperature : 0,
        windSpeed: typeof windSpeed === 'number' ? windSpeed : 0,
        description: 'Conditions from Open-Meteo',
        sunrise: null,
        sunset: null
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  /**
   * Fetch moon phase data for astrophotography planning
   */
  async fetchMoonPhase(date = new Date()) {
    try {
      // Calculate moon phase using a simple algorithm
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // Simple moon phase calculation (approximate)
      const c = Math.floor((year - 1900) / 100);
      const e = Math.floor((year - 1900 - c * 100) / 4);
      const a = (month < 3) ? month + 10 : month - 2;
      const b = (month < 3) ? year - 1901 : year - 1900;
      const d = Math.floor(365.25 * b) + Math.floor(30.6 * a) + day + e - c * 0.75 - 694039.09;
      const phase = (d % 29.53059) / 29.53059;

      const phaseNames = [
        'New Moon',
        'Waxing Crescent',
        'First Quarter',
        'Waxing Gibbous',
        'Full Moon',
        'Waning Gibbous',
        'Last Quarter',
        'Waning Crescent'
      ];

      const phaseIndex = Math.floor(phase * 8);
      const illumination = Math.abs(Math.sin(phase * Math.PI * 2)) * 100;

      return {
        phase: phaseNames[phaseIndex] || 'New Moon',
        illumination: Math.round(illumination),
        phaseValue: phase,
        date: date.toISOString()
      };
    } catch (error) {
      console.error('Error calculating moon phase:', error);
      return null;
    }
  }

  /**
   * Fetch aurora forecast data
   */
  async fetchAuroraForecast() {
    try {
      const response = await axios.get('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
      
      const latestData = response.data[response.data.length - 1];
      const kpIndex = parseFloat(latestData[1]);
      
      let visibility = 'None';
      let minLatitude = 90;
      
      if (kpIndex >= 9) {
        visibility = 'Extreme';
        minLatitude = 45;
      } else if (kpIndex >= 7) {
        visibility = 'Strong';
        minLatitude = 50;
      } else if (kpIndex >= 5) {
        visibility = 'Moderate';
        minLatitude = 55;
      } else if (kpIndex >= 3) {
        visibility = 'Low';
        minLatitude = 60;
      }

      return {
        kpIndex,
        visibility,
        minLatitude,
        timestamp: latestData[0]
      };
    } catch (error) {
      console.error('Error fetching aurora forecast:', error);
      return null;
    }
  }

  /**
   * Aggregate data from multiple sources to expand camera/lens database
   */
  async aggregateEquipmentData() {
    const results = {
      flickr: [],
      unsplash: [],
      kaggle: [],
      suggestions: []
    };

    // Fetch data from multiple sources
    const [flickrData, unsplashData, kaggleData] = await Promise.all([
      this.fetchFlickrCameraData('astrophotography', 50),
      this.fetchUnsplashPhotoData('milky way', 20),
      this.importKaggleCameras()
    ]);

    results.flickr = flickrData;
    results.unsplash = unsplashData;
    results.kaggle = kaggleData;

    // Generate suggestions based on popular combinations
    const popularCombos = flickrData
      .filter(item => item.count > 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    results.suggestions = popularCombos.map(combo => ({
      camera: combo.camera,
      lens: combo.lens,
      popularity: combo.count,
      recommended: true
    }));

    return results;
  }

  /**
   * Import and normalize Kaggle 1000 cameras dataset (CSV) if available locally.
   * Expected path: backend/data/kaggle_cameras.csv
   */
  async importKaggleCameras() {
    try {
      const csvPath = new URL('../data/kaggle_cameras.csv', import.meta.url);
      const res = await axios.get(csvPath.href);
      const lines = String(res.data).split('\n').filter(Boolean);
      const header = lines.shift();
      if (!header) return [];
      const cols = header.split(',').map(s => s.trim());
      const idxBrand = cols.findIndex(c => /brand/i.test(c));
      const idxModel = cols.findIndex(c => /model/i.test(c));
      const idxMount = cols.findIndex(c => /mount/i.test(c));
      const idxFormat = cols.findIndex(c => /sensor|format/i.test(c));
      const records = [];
      for (const line of lines) {
        const parts = line.split(',');
        const brand = parts[idxBrand] || 'Unknown';
        const name = parts[idxModel] || 'Unknown';
        const mount = parts[idxMount] || 'Unknown';
        const sensor_format = parts[idxFormat] || 'Unknown';
        const id = `${brand}-${name}`.toLowerCase().replace(/\s+/g, '-');
        records.push({ id, brand, name, mount, sensor_format, crop_factor: sensor_format.includes('Full') ? 1.0 : 1.5 });
      }
      return records;
    } catch (e) {
      return [];
    }
  }

  /**
   * Fetch light pollution metrics using LightPollutionMap QueryRaster API
   * Docs: https://www.lightpollutionmap.info/help.html
   * Returns radiance values across years and elevation
   */
  async fetchLightPollution(lat, lon, layer = 'viirs_2021') {
    try {
      if (!this.lpmapApiKey) {
        console.warn('LightPollutionMap API key not configured');
        return null;
      }
      const url = 'https://www.lightpollutionmap.info/QueryRaster/';
      const params = {
        qk: this.lpmapApiKey,
        ql: layer,
        qt: 'point_t',
        qd: `${lat},${lon}`
      };
      const response = await axios.get(url, {
        params,
        responseType: 'text'
      });
      const text = typeof response.data === 'string' ? response.data.trim() : '';
      // Expected format: "v1;v2;...;vn,elevation"
      let values = [];
      let elevation = null;
      if (text.includes(',')) {
        const [valsStr, elevStr] = text.split(',');
        values = valsStr.split(';').map(v => parseFloat(v)).filter(v => !isNaN(v));
        elevation = parseFloat(elevStr);
      } else {
        values = text.split(';').map(v => parseFloat(v)).filter(v => !isNaN(v));
      }
      const latest = values.length ? values[values.length - 1] : null;
      return { layer, values, latest, elevation };
    } catch (error) {
      console.error('Error fetching light pollution data:', error);
      return null;
    }
  }
}

export default new ExternalAPIService();