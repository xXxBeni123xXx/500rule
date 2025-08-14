import axios from 'axios';

// Weather service for astronomical conditions
class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Get current weather conditions for astronomy
  async getAstronomyConditions(lat, lon) {
    const cacheKey = `${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Get current weather
      const weatherResponse = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      // Get air quality data
      const airQualityResponse = await axios.get(`${this.baseUrl}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });

      const conditions = this.processWeatherData(weatherResponse.data, airQualityResponse.data);
      
      this.cache.set(cacheKey, {
        data: conditions,
        timestamp: Date.now()
      });

      return conditions;
    } catch (error) {
      console.error('Weather API error:', error);
      // Return mock data if API fails
      return this.getMockConditions();
    }
  }

  processWeatherData(weather, airQuality) {
    const clouds = weather.clouds?.all || 0;
    const visibility = weather.visibility || 10000;
    const humidity = weather.main?.humidity || 0;
    const windSpeed = weather.wind?.speed || 0;
    const temp = weather.main?.temp || 20;
    const dewPoint = this.calculateDewPoint(temp, humidity);
    
    // Calculate seeing conditions based on multiple factors
    const seeingScore = this.calculateSeeingScore({
      clouds,
      visibility,
      humidity,
      windSpeed,
      tempDiff: Math.abs(temp - dewPoint)
    });

    // Get moon illumination (simplified calculation)
    const moonPhase = this.calculateMoonPhase();
    
    return {
      location: {
        name: weather.name,
        country: weather.sys?.country,
        lat: weather.coord?.lat,
        lon: weather.coord?.lon
      },
      conditions: {
        cloudCover: {
          percentage: clouds,
          description: this.getCloudDescription(clouds)
        },
        visibility: {
          meters: visibility,
          kilometers: visibility / 1000,
          description: this.getVisibilityDescription(visibility)
        },
        humidity: {
          percentage: humidity,
          dewPoint: dewPoint.toFixed(1)
        },
        wind: {
          speed: windSpeed,
          direction: weather.wind?.deg || 0,
          description: this.getWindDescription(windSpeed)
        },
        temperature: {
          current: temp,
          feelsLike: weather.main?.feels_like || temp
        },
        pressure: weather.main?.pressure || 1013,
        airQuality: {
          aqi: airQuality.list?.[0]?.main?.aqi || 1,
          pm25: airQuality.list?.[0]?.components?.pm2_5 || 0,
          description: this.getAQIDescription(airQuality.list?.[0]?.main?.aqi || 1)
        }
      },
      astronomy: {
        moonPhase: moonPhase,
        moonIllumination: this.getMoonIllumination(moonPhase),
        seeingScore: seeingScore,
        recommendation: this.getRecommendation(seeingScore, clouds, moonPhase)
      },
      timestamp: new Date().toISOString()
    };
  }

  calculateDewPoint(temp, humidity) {
    // Magnus formula for dew point calculation
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  calculateSeeingScore({ clouds, visibility, humidity, windSpeed, tempDiff }) {
    let score = 100;
    
    // Cloud cover impact (0-40 points)
    score -= (clouds / 100) * 40;
    
    // Visibility impact (0-20 points)
    if (visibility < 5000) score -= 20;
    else if (visibility < 10000) score -= 10;
    
    // Humidity impact (0-15 points)
    if (humidity > 80) score -= 15;
    else if (humidity > 60) score -= 7;
    
    // Wind impact (0-15 points)
    if (windSpeed > 10) score -= 15;
    else if (windSpeed > 5) score -= 7;
    
    // Temperature differential impact (0-10 points)
    if (tempDiff < 2) score -= 10;
    else if (tempDiff < 5) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  calculateMoonPhase() {
    // Simplified moon phase calculation
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Calculate days since new moon (Jan 6, 2000)
    const baseDate = new Date(2000, 0, 6);
    const daysSince = (now - baseDate) / (1000 * 60 * 60 * 24);
    const lunarCycle = 29.53059;
    const phase = (daysSince % lunarCycle) / lunarCycle;
    
    if (phase < 0.03 || phase > 0.97) return 'new';
    if (phase < 0.22) return 'waxing_crescent';
    if (phase < 0.28) return 'first_quarter';
    if (phase < 0.47) return 'waxing_gibbous';
    if (phase < 0.53) return 'full';
    if (phase < 0.72) return 'waning_gibbous';
    if (phase < 0.78) return 'last_quarter';
    return 'waning_crescent';
  }

  getMoonIllumination(phase) {
    const illumination = {
      'new': 0,
      'waxing_crescent': 25,
      'first_quarter': 50,
      'waxing_gibbous': 75,
      'full': 100,
      'waning_gibbous': 75,
      'last_quarter': 50,
      'waning_crescent': 25
    };
    return illumination[phase] || 0;
  }

  getCloudDescription(percentage) {
    if (percentage <= 10) return 'Clear';
    if (percentage <= 25) return 'Mostly Clear';
    if (percentage <= 50) return 'Partly Cloudy';
    if (percentage <= 75) return 'Mostly Cloudy';
    return 'Overcast';
  }

  getVisibilityDescription(meters) {
    if (meters >= 10000) return 'Excellent';
    if (meters >= 6000) return 'Good';
    if (meters >= 3000) return 'Moderate';
    if (meters >= 1000) return 'Poor';
    return 'Very Poor';
  }

  getWindDescription(speed) {
    if (speed < 1) return 'Calm';
    if (speed < 5) return 'Light';
    if (speed < 10) return 'Moderate';
    if (speed < 15) return 'Fresh';
    return 'Strong';
  }

  getAQIDescription(aqi) {
    switch(aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  }

  getRecommendation(score, clouds, moonPhase) {
    if (score >= 80) {
      return {
        rating: 'Excellent',
        message: 'Perfect conditions for astrophotography!',
        icon: '🌟'
      };
    } else if (score >= 60) {
      return {
        rating: 'Good',
        message: 'Good conditions for most astrophotography.',
        icon: '⭐'
      };
    } else if (score >= 40) {
      return {
        rating: 'Fair',
        message: 'Acceptable conditions, but not ideal.',
        icon: '🌙'
      };
    } else if (score >= 20) {
      return {
        rating: 'Poor',
        message: 'Challenging conditions for astrophotography.',
        icon: '☁️'
      };
    } else {
      return {
        rating: 'Very Poor',
        message: 'Not recommended for astrophotography.',
        icon: '🌧️'
      };
    }
  }

  getMockConditions() {
    return {
      location: {
        name: 'Unknown',
        country: 'XX',
        lat: 0,
        lon: 0
      },
      conditions: {
        cloudCover: {
          percentage: 20,
          description: 'Mostly Clear'
        },
        visibility: {
          meters: 10000,
          kilometers: 10,
          description: 'Excellent'
        },
        humidity: {
          percentage: 50,
          dewPoint: '10.0'
        },
        wind: {
          speed: 3,
          direction: 180,
          description: 'Light'
        },
        temperature: {
          current: 20,
          feelsLike: 19
        },
        pressure: 1013,
        airQuality: {
          aqi: 1,
          pm25: 5,
          description: 'Good'
        }
      },
      astronomy: {
        moonPhase: 'waxing_crescent',
        moonIllumination: 25,
        seeingScore: 75,
        recommendation: {
          rating: 'Good',
          message: 'Good conditions for most astrophotography.',
          icon: '⭐'
        }
      },
      timestamp: new Date().toISOString()
    };
  }
}

export default new WeatherService();